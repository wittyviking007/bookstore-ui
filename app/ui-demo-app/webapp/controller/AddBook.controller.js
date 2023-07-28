sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ], function(Controller, MessageToast, JSONModel) {
    "use strict";
  
    return Controller.extend("sap.ui.demo.walkthrough.controller.AddBook", {
      onInit: function() {
        // Create a new JSONModel to hold the data for the new book
        var oModel = new JSONModel({
          title: "",
          author: ""
          // Add more properties as needed for other book properties
        });
        this.getView().setModel(oModel, "newBookModel");
      },
  
      // Event handler for the "Add Book" button press
      onAddBookPress: function() {
        // Open the dialog to add a new book
        this.byId("addBookDialog").open();
      },
  
      // Event handler for the "Add" button in the dialog
      onDialogAddPress: function() {
        // Get the data for the new book from the model
        var oNewBookData = this.getView().getModel("newBookModel").getData();
  
        // Perform your logic to add the book (e.g., update the model or send the data to the server)
        // Replace the following line with your actual logic to add the book
        // For this example, we'll just show a message indicating that the book has been added.
        MessageToast.show("Book Added: " + oNewBookData.title);
  
        // Close the dialog after adding the book
        this.byId("addBookDialog").close();
  
        // Reset the model to clear the data for the new book
        this.getView().getModel("newBookModel").setData({
          title: "",
          author: ""
          // Reset other properties as needed
        });
      },
  
      // Event handler for the "Cancel" button in the dialog
      onDialogCancelPress: function() {
        // Close the dialog without adding the book
        this.byId("addBookDialog").close();
  
        // Reset the model to clear the data for the new book
        this.getView().getModel("newBookModel").setData({
          title: "",
          author: ""
          // Reset other properties as needed
        });
      }
    });
  });
  