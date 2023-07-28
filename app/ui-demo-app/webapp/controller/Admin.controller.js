sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Dialog"
], function (Controller, JSONModel, formatter, Filter, FilterOperator, Dialog) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.Admin", {
		formatter: formatter,
		onInit: function () {

			var oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");



			// trying if my-bookshop is working

			var oModel = new JSONModel();
			var oData = {
				Invoices: [] // Initialize with an empty array
			};
			oModel.setData(oData);
			this.getView().setModel(oModel, "invoice");

			const accessToken = '<access_token>'; // Replace with your actual access token

			fetch('http://localhost:52313/odata/v4/catalog/Books', {
				method: 'GET',
				headers: {
					// 'Content-Type': 'application/json',
					// 'Authorization': 'Bearer ' + accessToken
				}
			})
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Request failed with status ' + response.status);
					}
				})
				.then(async data => {
					for (let i = 0; i < data.value.length; i++) {
						var obj = data.value[i];
						var authorId = data.value[i].author_ID;
						await fetch(`http://localhost:52313/odata/v4/catalog/Authors(${authorId})`, {
							method: 'GET',
							headers: {
								// 'Content-Type': 'application/json',
								// 'Authorization': 'Bearer ' + accessToken
							}
						})
							.then(response => {
								if (response.ok) {
									return response.json();
								} else {
									throw new Error('Request failed with status ' + response.status);
								}
							})
							.then(data2 => {
								obj.authorName = data2.name;
								data.value[i] = obj;
								// console.log(data.value[i]);
								// console.log(data); // Handle the response data
							})
							.catch(error => {
								console.error(error); // Handle any errors
							});

					}
					var oModel = this.getView().getModel("invoice");
					oModel.setProperty("/Books", data.value);

					// var oViewModel2 = new JSONModel(data);
					// this.getView().setModel(oViewModel2, "invoice");
					// oViewModel2.setProperty("/Invoices", data.value);

					console.log(data.value[0]); // Handle the response data
				})
				.catch(error => {
					console.error(error); // Handle any errors
				});

			this.oFormDataModel = new JSONModel({
				ID: "",
				title: "",
				descr: "",
				author_ID: "",
				stock: "",
				price: "",
				currency_code: "USD",
				quantity: 0
			});

		},

		onFilterInvoices: function (oEvent) {
			// build filter array
			var aFilter = []
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("invoiceList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var sInvoiceId = oItem.getBindingContext("invoice").getProperty("ID");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substr(1)),
				invoiceId: sInvoiceId,
			});
		},
		onSave: function (oEvent) {
			// Get the selected row data and column values
			const oListItem = oEvent.getSource().getParent();
			const oBindingContext = oListItem.getBindingContext("invoice");
			const oModelData = oBindingContext.getObject();

			const rowId = oModelData.ID;
			const title = oModelData.title;
			const authorId = oModelData.author_ID;
			const authorName = oModelData.authorName;
			const desc = oModelData.descr;
			var stock = oModelData.stock;
			const price = oModelData.price;

			// Perform the desired action (e.g., update the database)
			// update book details
			fetch(`http://localhost:52313/odata/v4/catalog/Books(${rowId})`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title,
					author_ID: authorId,
					// descr: desc,
					stock: stock,
					price: price,
					currency_code: "USD",
					quantity: 0,
				})
			})
				.then(response => {
					if (response.ok) {
						console.log('Book updated successfully!');
					} else {
						console.log('Error updating the book. Status:', response.status);
					}
				})
				.catch(error => {
					console.error('Error updating the book:', error);
				});

			fetch(`http://localhost:52313/odata/v4/catalog/Authors(${authorId})`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: authorName
				})
			})
				.then(response => {
					if (response.ok) {
						console.log('Author name updated successfully!');
					} else {
						console.log('Error updating author name. Status:', response.status);
					}
				})
				.catch(error => {
					console.error('Error updating author name:', error);
				});


			// For demonstration purposes, log the retrieved values
			console.log("Row ID:", rowId);
			console.log("Title:", title);
			console.log("Author Id:", authorId);
			console.log("Author Name:", authorName);
			console.log("Stock:", stock);
			console.log("Price:", desc);

			// location.reload();
		},

		onOpenDialog: function () {
			if (!this.oDialog) {
				// Create the Dialog only once
				this.oDialog = new Dialog({
					title: "Add New Book",
					content: [
						// new sap.m.Label({ text: "ID" }),
						// new sap.m.Input({ value: "{/ID}" }),
						new sap.m.Label({ text: "Title" }),
						new sap.m.Input({ value: "{/title}" }),
						// Add other form fields as needed
						new sap.m.Label({ text: "Author Name" }),
						new sap.m.Input({ value: "{/authorName}" }),
						new sap.m.Label({ text: "Stock" }),
						new sap.m.Input({ value: "{/stock}" }),
						new sap.m.Label({ text: "Price" }),
						new sap.m.Input({ value: "{/price}" }),
						new sap.m.Label({ text: "Description" }),
						new sap.m.TextArea({ value: "{/descr}", rows: 5 }),
					],
					beginButton: new sap.m.Button({
						text: "Save",
						press: function () {
							// Save the form data to your model or handle the data as needed
							// For example, you can get the data using this.oFormDataModel.getData()
							var book = this.oFormDataModel.getData();
							fetch(`http://localhost:52313/odata/v4/catalog/Books`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									title: book.title,
									author_ID: 256,
									descr: book.descr,
									// stock: book.stock,
									price: book.price,
									currency_code: "USD",
									quantity: 2,
								})
							})
								.then(response => {
									if (response.ok) {
										console.log('Book updated successfully!');
									} else {
										console.log('Error updating the book. Status:', response.status);
									}
								})
								.catch(error => {
									console.error('Error updating the book:', error);
								});

							fetch(`http://localhost:52313/odata/v4/catalog/Authors`, {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: book.authorName
								})
							})
								.then(response => {
									if (response.ok) {
										console.log('Author name updated successfully!');
									} else {
										console.log('Error updating author name. Status:', response.status);
									}
								})
								.catch(error => {
									console.error('Error updating author name:', error);
								});


							console.log(this.oFormDataModel.getData());
							this.oDialog.close();
						}.bind(this)
					}),
					endButton: new sap.m.Button({
						text: "Cancel",
						press: function () {
							this.oDialog.close();
						}.bind(this)
					})
				});
			}

			// Set the JSONModel to the Dialog's internal model
			this.oDialog.setModel(this.oFormDataModel);

			// Open the Dialog
			this.oDialog.open();
		}

		// onBookNameChange: function (oEvent) {
		// 	var oItem = oEvent.getSource().getParent();
		// 	var oContext = oItem.getBindingContext("invoice");
		// 	var sPath = oContext.getPath();
		// 	var sNewBookName = oEvent.getParameter("value");
		// 	var oContext2 = oEvent.getSource().getBindingContext("invoice");

		// 	// Retrieve the book ID from the binding context
		// 	var sPath = oContext2.getPath();
		// 	// var bookId = sPath.match(/\(([^)]+)\)/)[1];
		// 	console.log(oEvent.getSource());

		// 	// Now you have the book ID and the new book name, and you can perform the update
		// 	// For example, you can update the model or send the update to the server using OData

		// 	// Update the model (if "invoice" is the name of your model)
		// 	var oModel = this.getView().getModel("invoice");
		// 	oModel.setProperty(sPath + "/title", sNewBookName);
		// 	console.log(sPath);


		// 	// Get the binding context of the row where the change occurred
		// 	var oContext3 = oEvent.getSource().getBindingContext("invoice");

		// 	// Retrieve the book ID from the custom data attribute in the Input field
		// 	var sRowId = oEvent.getSource().data("customDataId");

		// 	// Now you have the book ID (sRowId) and the new book name (sNewBookName)
		// 	// Perform any further processing or updates as needed
		// 	console.log("Row ID:", sRowId);
		// 	console.log("New book name:", sNewBookName);

		// 	var oRowIdControl = this.getView().byId("rowId");

		// 	// Retrieve the value from the ObjectNumber control
		// 	// var rowIdValue = oRowIdControl.getText();
		// 	console.log(this);

		// 	const url = `http://localhost:52313/odata/v4/catalog/Books(${bookId})`;

		// 	// Fetch the existing data of the book first
		// 	fetch(url)
		// 		.then(response => {
		// 			if (!response.ok) {
		// 				throw new Error('Network response was not ok');
		// 			}
		// 			return response.json();
		// 		})
		// 		.then(existingData => {
		// 			// Modify only the 'title' property while keeping others unchanged
		// 			const updatedData = {
		// 				...existingData,
		// 				title: 'new book name 2'
		// 			};

		// 			// Perform the PUT request to update the title
		// 			return fetch(url, {
		// 				method: 'PUT',
		// 				headers: {
		// 					'Content-Type': 'application/json'
		// 				},
		// 				body: JSON.stringify(updatedData)
		// 			});
		// 		})
		// 		.then(response => {
		// 			if (!response.ok) {
		// 				throw new Error('Network response was not ok');
		// 			}
		// 			return response.json();
		// 		})
		// 		.then(data => {
		// 			console.log('Updated data:', data);
		// 		})
		// 		.catch(error => {
		// 			console.error('Error:', error);
		// 		});



		// 	// Update the "bookName" property in the model
		// 	this.getView().getModel("invoice").setProperty(sPath + "/title", sNewBookName);
		// },

		// onPriceChange: function (oEvent) {
		// 	var oItem = oEvent.getSource().getParent();
		// 	var oContext = oItem.getBindingContext("invoice");
		// 	var sPath = oContext.getPath();
		// 	var sNewPrice = oEvent.getParameter("value");

		// 	// Update the "price" property in the model
		// 	this.getView().getModel("invoice").setProperty(sPath + "/price", parseFloat(sNewPrice));
		// },

	});
});