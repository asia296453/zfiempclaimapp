/*global location */
sap.ui.define([
	"zfiempclaimapp/controller/BaseController",
	'sap/ui/model/Filter',
	"sap/ui/model/FilterOperator",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/PDFViewer",
	'sap/ui/export/Spreadsheet'
], function (BaseController, Filter, FilterOperator, UploadCollectionParameter, JSONModel, MessageBox, MessageToast,PDFViewer,Spreadsheet) {
	"use strict";
	var editMode = false;
	var EdmType = sap.ui.export.EdmType;
	return BaseController.extend("zfiempclaimapp.controller.Detail", {


		/* =========================================================== */
		/* lifecycle methods                              u             */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "detailView");
			
			this._oODataModel = this.getOwnerComponent().getModel();
			this._oResourceBundle = this.getResourceBundle();
			//	console.log(oODataModel);


		},


		_onObjectMatched: function (oEvent) {
			this.showBusy(true);
			var oParameter = decodeURIComponent(oEvent.getParameter("arguments").SerialNo).trim();
			if(window.location.href.indexOf("mail") !== -1){
				sap.ui.getCore().byId("container-zfiempclaimapp---App--idAppControl-Master").setVisible(false);
			}
			this.Claimno = oParameter;
			this._bindView(oParameter);
		},

		_bindView: function (sSerialNo) {
			// Set busy indicator during view binding

			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			var b = {
				Claimno: sSerialNo,
				LotNo: "",
				LabelText: "",
				sListType: "",
				checkAttachmentData: "",
				bError: "",
				bErrorMessage: "Please update mandatory attachments"
			};
			var a = new JSONModel({
				ShipType_TEXT: "",
				ShipType_URL: "",
				MV_TEXT: "",
				MV_URL: "",
				OP_TEXT: "",
				OP_URL: "",
				AU_TEXT: "",
				AU_URL: "",
				CU_TEXT: "",
				CU_URL: "",
				OT_TEXT: "",
				OT_URL: ""
			});
			this.setModel(a, "DisplayAttachmentModel");
			this.setModel(b, "AttachmentType");
			//this.readAllAttachmentData('', '');
			this.getViewData(sSerialNo);
			var sstr1 = {
				"editable": true
			}
			this.getOwnerComponent().getModel("Header").setProperty("/data", sstr1);
		},
		formatDate: function (e) {
            if (e === undefined || e === null || e === "") {
                return
            }
            var t = new Date(e),
                i = "" + (e.getMonth() + 1),
                a = "" + e.getDate(),
                r = e.getFullYear();
            if (i.length < 2) i = "0" + i;
            if (a.length < 2) a = "0" + a;
            return [a, i, r].join(".")
        },
        onUpload: function(e) {
                
            this._import(e.getParameter("files") && e.getParameter("files")[0])
        },


	});
});