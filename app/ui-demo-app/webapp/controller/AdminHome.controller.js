sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
  ], function(Controller, History) {
    "use strict";
  
    return Controller.extend("sap.ui.demo.walkthrough.controller.AdminHome", {
      // Event handler for Button 1 press (navigates to Page 1)
      onButton1Press: function() {
        console.log("button 1 clicked");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("admin"); // Replace "Page1" with the name of your target view or route for the first page
      },
  
      // Event handler for Button 2 press (navigates to Page 2)
      onButton2Press: function() {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("ordersadmin"); // Replace "Page2" with the name of your target view or route for the second page
      },
  
      // Function to navigate back to the previous page (optional)
      onNavBack: function() {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();
        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo(""); // Replace "Default" with the name of your default route or view
        }
      }
    });
  });
  