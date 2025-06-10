sap.ui.define(["zfiempclaimapp/controller/BaseController", "sap/ui/model/json/JSONModel"], function(e, t) {
    "use strict";
    return e.extend("zfiempclaimapp.controller.App", {
        onInit: function() {
            var e, o, n = this.getOwnerComponent().oListSelector,
                s = this.getView().getBusyIndicatorDelay();
            e = new t({
                busy: true,
                delay: 0,
                itemToSelect: null,
                addEnabled: false
            });
            this.setModel(e, "appView");
            o = function() {
                e.setProperty("/busy", false);
                e.setProperty("/delay", s)
            };
            this.getOwnerComponent().getModel().metadataLoaded().then(o);
            n.attachListSelectionChange(function() {
                this.byId("idAppControl").hideMaster()
            }, this);
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass())
        }
    })
});