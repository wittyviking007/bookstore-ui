sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/demo/walkthrough/globalVariables"
], function (Controller, JSONModel) {
    "use strict";

    var oModel2 = new JSONModel();
    return Controller.extend("sap.ui.demo.walkthrough.controller.Overview", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("overview").attachPatternMatched(this._onRouteMatched, this);

            // var sName = this.getView().getModel("myModel").getProperty("/name");
            // console.log("Name:", sName);

        },
        _onRouteMatched: function (oEvent) {
            console.log(oEvent);
            var sName = oEvent.getParameter("arguments").name;
            // Now you can use the 'sName' variable to access the value passed from the previous page.
            username = sName;
            console.log(username);
            console.log("Name parameter:", sName);
            // Do further processing with the parameter value as needed.
            oModel2.setData({
                uName: sName
            });
            this.getView().setModel(oModel2, "myModel");
        },
        onViewOrders: function (oEvent) {
            var sOrderName = oModel2.getProperty("/uName");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            console.log(username);
            oRouter.navTo("orders", {
                name: sOrderName // Replace "John Doe" with the parameter value you want to pass
            });
        },
    });
});