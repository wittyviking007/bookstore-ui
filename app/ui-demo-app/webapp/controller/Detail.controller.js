sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, UIComponent, History, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("sap.ui.demo.walkthrough.controller.Detail", {
        onInit: function () {
            var oViewModel = new JSONModel({
                currency: "EUR"
            });
            this.getView().setModel(oViewModel, "view");

            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            var sInvoiceId = oEvent.getParameter("arguments").invoiceId;
            console.log(sInvoiceId);

            var oModel = new JSONModel();

            var bookId = oEvent.getParameter("arguments").invoiceId;
            fetch(`http://localhost:52313/odata/v4/catalog/Books(${bookId})`, {
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
                .then(data => {
                    // var oModel = this.getView().getModel("invoice");
					// oModel.setProperty("/Books", data.value);
                    oModel.setData(data);
                    // Set the model to the view
                    this.getView().setModel(oModel, "bookDetail");

                    console.log(data); // Handle the response data
                })
                .catch(error => {
                    console.error(error); // Handle any errors
                });


            this.byId("rating").reset();
            this.getView().bindElement({
                // path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").invoicePath),
                path: "/" + sInvoiceId,
                model: "invoice"
            })
        },
        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter.navTo("overview", {}, true);
            }

        },
        // onRatingChange: function (oEvent) {
        // 	var fValue = oEvent.getParameter("value");
        // 	var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        // 	MessageToast.show(oResourceBundle.getText("ratingConfirmation", [fValue]));
        // }
    });
});