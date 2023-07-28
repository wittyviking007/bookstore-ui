sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("sap.ui.demo.walkthrough.controller.Login", {
    onInit: function () {
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

    },
    onOpenDialog: function () {
      this.getOwnerComponent().openHelloDialog();
    },
    onLoginPress: function () {
      var oView = this.getView();
      var sUsername = oView.byId("usernameInput").getValue();
      var sPassword = oView.byId("passwordInput").getValue();

      console.log("Username: ", sUsername);
      console.log("Password: ", sPassword);

      // Add your authentication logic here (e.g., connecting to a backend service)
      if (sUsername === "admin" && sPassword === "password") {
        MessageToast.show("Login successful!");
        this.onNavigateToAdminPage();
      } else if (sUsername === "sabine" && sPassword === "pass_sabine") {
        MessageToast.show("Login successful for sabine");
        this.onNavigateToOverViewPage(sUsername);
      } else if (sUsername === "mia" && sPassword === "pass_mia") {
        MessageToast.show("Login successful for mia");
        this.onNavigateToOverViewPage(sUsername);
      } else if (sUsername === "klaus" && sPassword === "pass_klaus") {
        MessageToast.show("Login successful for klaus");
        this.onNavigateToOverViewPage(sUsername);
      }
    },
    onNavigateToAdminPage: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("adminhome"); // "admin" is the name of the route for the admin page
    },
    onNavigateToOverViewPage: function (sUsername) {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("overview", {
        name: sUsername // Replace "John Doe" with the parameter value you want to pass
      });
    }
  });
});
