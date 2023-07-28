sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/UIComponent",
    "sap/ui/demo/walkthrough/globalVariables"
], function (Controller, JSONModel) {
    "use strict";

    var oModel3 = new JSONModel();
    return Controller.extend("sap.ui.demo.walkthrough.controller.OrdersAdmin", {
        onInit: function () {
            var url = 'http://localhost:52313/odata/v4/catalog/Orders';
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
        },
    });
});
