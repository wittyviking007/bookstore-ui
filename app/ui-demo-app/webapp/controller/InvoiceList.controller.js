sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/demo/walkthrough/globalVariables"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.ui.demo.walkthrough.controller.InvoiceList", {
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
								console.log(data.value[i]);
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

					// console.log(data); // Handle the response data
				})
				.catch(error => {
					console.error(error); // Handle any errors
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
		onCheckboxSelect: function (event) {
			var oTable = this.getView().byId("invoiceList"); // Assuming your table ID is "invoiceList"
			var oItems = oTable.getItems();

			var aSelectedIds = [];
			oItems.forEach(function (oItem) {
				var oCheckbox = oItem.getCells()[0]; // Assuming the checkbox is the first cell in the row
				if (oCheckbox.getSelected()) {
					var oBindingContext = oItem.getBindingContext("invoice");
					var sId = oBindingContext.getProperty("ID");
					aSelectedIds.push(sId);
				}
			});

			console.log("Selected Invoice IDs:", aSelectedIds);
		},
		onPlaceOrderClick: function () {
			// fetch all the selected books
			var oTable = this.getView().byId("invoiceList"); // Assuming your table ID is "invoiceList"
			var oItems = oTable.getItems();

			var aSelectedBooks = [];
			var sumTotal = 0;
			oItems.forEach(function (oItem) {
				var oCheckbox = oItem.getCells()[0]; // Assuming the checkbox is the first cell in the row
				if (oCheckbox.getSelected()) {
					var oBindingContext = oItem.getBindingContext("invoice");
					var sId = oBindingContext.getProperty("ID");
					var sTitle = oBindingContext.getProperty("title");
					var sQuantity = oBindingContext.getProperty("quantity");
					var sPrice = oBindingContext.getProperty("price");
					aSelectedBooks.push({
						id: sId,
						title: sTitle,
						quantity: sQuantity,
						price: sPrice,
						total: sQuantity * sPrice,
					});
					sumTotal += (sQuantity * sPrice);
				}
			});

			console.log("Selected Invoice IDs:", aSelectedBooks);
			console.log(username);
			// Create a dialog
			var oDialog = new sap.m.Dialog({
				title: "Order Summary",
				contentWidth: "400px",
				beginButton: new sap.m.Button({
					text: "Close",
					press: function () {
						oDialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: "Confirm Order",
					press: function () {
						// post request to decrease stock of all the selected books
						aSelectedBooks.forEach(function (book) {
							// send post request for each book
							fetch('http://localhost:52313/odata/v4/catalog/Orders', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									book_ID: book.id,
									bookName: book.title,
									price: book.price,
									amount: book.quantity,
									orderName: username
								})
							})
								.then(response => {
									if (response.ok) {
										console.log('Order placed successfully!');
									} else {
										console.log('Error placing order. Status:', response.status);
									}
								})
								.catch(error => {
									console.error('Error placing order:', error);
								});

						});

						oDialog.close();
						location.reload(); // Reload the page
						sap.m.MessageToast.show("Order placed successfully!");
					}
				})
			});

			// Create a table for order summary
			var oTable = new sap.m.Table({
				columns: [
					new sap.m.Column({ header: new sap.m.Text({ text: "Product" }) }),
					new sap.m.Column({ header: new sap.m.Text({ text: "Quantity" }) }),
					new sap.m.Column({ header: new sap.m.Text({ text: "Price of 1 book" }) }),
					new sap.m.Column({ header: new sap.m.Text({ text: "Total Price" }) }),
				]
			});

			// Add table rows for order items from the aSelectedBooks array
			aSelectedBooks.forEach(function (book) {
				oTable.addItem(new sap.m.ColumnListItem({
					cells: [
						new sap.m.Text({ text: book.title }),
						new sap.m.Text({ text: book.quantity.toString() }),
						new sap.m.Text({ text: book.price.toString() }),
						new sap.m.Text({ text: "$" + (book.total).toFixed(2) })
					]
				}));
			});

			// total cost display
			var oTotalCostText = new sap.m.Title({
				text: "Total Cost: " + sumTotal.toFixed(2) + " USD"
			});

			// Add the table to the dialog
			oDialog.addContent(oTable);
			oDialog.addContent(oTotalCostText);

			// Open the dialog
			oDialog.open();
		},
		onQuantityChange: function (event) {
			var oInput = event.getSource();
			var sNewValue = oInput.getValue();

			// Perform any necessary logic with the new quantity value
			console.log("New Quantity:", sNewValue);
		},
		// onCheckboxSelect: function(event) {
		// 	var oCheckbox = event.getSource();
		// 	var bSelected = oCheckbox.getSelected();

		// 	var oStepInput = this.getView().byId("stepInputId"); // Replace "stepInputId" with the actual ID of your StepInput control
		// 	oStepInput.setEnabled(bSelected);
		// }
		onNavigateToAdminPage: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login"); // "admin" is the name of the route for the admin page
		},




	});
});