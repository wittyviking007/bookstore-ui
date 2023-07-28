sap.ui.define([
    "sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment",
    "sap/ui/core/syncStyleClass"
], function (ManagedObject, Fragment, syncStyleClass) {
    "use strict";

    return ManagedObject.extend("sap.ui.demo.walkthrough.controller.HelloDialog", {
        constructor: function (oView) {
            this._oView = oView;
        },

        exit: function () {
            delete this._oView
        },

        open: function () {
            var oView = this._oView;

            // create the dialog lazily
            if (!oView.byId("helloDialog")) {
                var oFragmentController = {
                    onCloseDialog: function () {
                        oView.byId("helloDialog").close();
                    }
                }

                // load asynchronously
                Fragment.load({
                    id: oView.getId(),
                    name: "sap.ui.demo.walkthrough.fragment.HelloDialog",
                    controller: oFragmentController
                }).then(function (oDialog) {
                    // connct dialog to root view of the component
                    oView.addDependent(oDialog);
                    // forward compact/cozy style into dialog
                    syncStyleClass(oView.getController().getOwnerComponenet().getContentDensityClass(), oView, oDialog);
                    oDialog.open();
                })
            } else {
                oView.byId("helloDialog").open();
            }


        }
    });
});