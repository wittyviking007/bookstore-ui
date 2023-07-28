sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/demo/walkthrough/globalVariables"
], function (Controller, JSONModel) {
    "use strict";

    var oModel3 = new JSONModel();
    return Controller.extend("sap.ui.demo.walkthrough.controller.Orders", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("orders").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
          // Get the order name from the route parameters
          var sOrderName = oEvent.getParameter("arguments").name;
          // Now you can use sOrderName in your logic
          console.log("Order Name2:", sOrderName);
          username = sOrderName;
          var name = sOrderName;
          var url = 'http://localhost:52313/odata/v4/catalog/Orders?$filter=orderName eq \'' + name + '\'';
            fetch(url, {
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
                    for (let i = 0; i < data.value.length; i++) {
                        const obj = data.value[i];
                        for (const key in obj) {
                            if (obj.hasOwnProperty(key) && key === "createdAt") {
                                var dateTime = obj[key];
                                const date = dateTime.split("T")[0];
                                const time = dateTime.split("T")[1].split(".")[0];
                                
                                // console.log("Date:", date); // Output: "2023-07-26"
                                // console.log("Time:", time); // Output: "10:30:26"

                                obj.date = date;
                                obj.time = time;
                            }
                          }
                        data.value[i] = obj;
                        console.log(data.value[i]);
                      }
                    // oModel3.setData(data.value);
                    oModel3.setProperty("/Orders", data.value);
                    this.getView().setModel(oModel3, "order");
                    console.log(oModel3.getProperty("/Orders"));
                })
                .catch(error => {
                    console.error(error); // Handle any errors
                });

            // Create a JSON model and set the data
            // var oModel = new JSONModel(oData);
            // this.getView().setModel(oModel);
        }
    });
});
