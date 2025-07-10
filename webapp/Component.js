sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "zfiempclaimapp/model/models",
	"zfiempclaimapp/controller/ListSelector", "zfiempclaimapp/controller/ErrorHandler"
], function (e, t, s, o, i) {
	"use strict";
	return e.extend("zfiempclaimapp.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			this.oListSelector = new o;
			this._oErrorHandler = new i(this);
			this.setModel(s.createDeviceModel(), "device");
			this.setModel(s.createFLPModel(), "FLP");
			e.prototype.init.apply(this, arguments);
			this.getRouter().initialize();

			
            this.setModel(new sap.ui.model.json.JSONModel(), "display");
            this.setModel(new sap.ui.model.json.JSONModel(), "approvaldetails");
            this.setModel(new sap.ui.model.json.JSONModel(), "Header");
            this.setModel(new sap.ui.model.json.JSONModel(), "ExpType");
            this.setModel(new sap.ui.model.json.JSONModel(), "ViewVis");
            this.setModel(new sap.ui.model.json.JSONModel(), "approvallog");
			this.setModel(new sap.ui.model.json.JSONModel(), "LocalModel");
			this.setModel(new sap.ui.model.json.JSONModel(), "DisplayAttachmentModel");
            this.setModel(new sap.ui.model.json.JSONModel(), "UploadAttachmentModel");
            this.setModel(new sap.ui.model.json.JSONModel(), "AttachmentType");
			this.setModel(new sap.ui.model.json.JSONModel(), "Master");
			this.setModel(new sap.ui.model.json.JSONModel(), "MasterList");
			this.setModel(new sap.ui.model.json.JSONModel(), "item");
			this.setModel(new sap.ui.model.json.JSONModel(), "user");
			this.setModel(new sap.ui.model.json.JSONModel(), "Taxcode");

			var jModel28 = new sap.ui.model.json.JSONModel();
            this.setModel(jModel28, "DisplayAttachmentModel");
			var jModel29 = new sap.ui.model.json.JSONModel();
            this.setModel(jModel29, "UploadAttachmentModel");
			var jModel30 = new sap.ui.model.json.JSONModel();
            this.setModel(jModel30, "AttachmentType");
			
		},
		
		destroy: function () {
			this.oListSelector.destroy();
			this._oErrorHandler.destroy();
			e.prototype.destroy.apply(this, arguments)
		},
		getContentDensityClass: function () {
			
			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = ""
				} else if (!t.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact"
				} else {
					this._sContentDensityClass = "sapUiSizeCozy"
				}
			}
			return this._sContentDensityClass
		}
	})
});