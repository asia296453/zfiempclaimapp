sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/m/MessageBox", 'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator", "sap/ui/model/json/JSONModel",  "sap/ui/core/Fragment", "sap/m/UploadCollectionParameter"
], function (e, t, MessageBox, Filter, FilterOperator, JSONModel, Fragment, r) {
    "use strict";
    return e.extend("zfiempclaimapp.controller.BaseController", {
        onInit: function () {

        },
        ondisplayAttachments: function (oEvent) {
            var e = 'AT';
            var t = this.getView(),
                a = this.getModel("i18n");
           // this._oAttachmentDialog = t.byId("idDialogUploadAttachments11");
            var LabelText = e;
            if (!this._oAttachmentDialog) {
                this._oAttachmentDialog = sap.ui.xmlfragment(t.getId(), "zfiempclaimapp.fragment.DisplayAttachments", this);
                t.addDependent(this._oAttachmentDialog)
            }
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oAttachmentDialog);
            this.getView().setBusy(true);
            var sclaimno = this.getOwnerComponent().getModel("display").getData().results.Claimno;
            this.readAllAttachmentData(e, 'X',sclaimno);
            var i = this.getOwnerComponent().getModel("UploadAttachmentModel");
            i.setData({
                ATTACHSet: []
            })
        },
        onUploadAttachments: function (oEvent) {
            var e = 'AT';
            var t = this.getView(),
                a = this.getModel("i18n");
        //    this._oAttachmentDialog = t.byId("idDialogUploadAttachments");
            var LabelText = e;
            if (!this._oAttachmentDialog) {
                this._oAttachmentDialog = sap.ui.xmlfragment(t.getId(), "zfiempclaimapp.fragment.UploadAttachments", this);
                t.addDependent(this._oAttachmentDialog)
            }
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oAttachmentDialog);
            this.getView().setBusy(true);

            this.readAllAttachmentData(e, 'X','0');
            var i = this.getOwnerComponent().getModel("UploadAttachmentModel");
            i.setData({
                ATTACHSet: []
            })
        },
        readAllAttachmentData: function (e, bflag,sclaimno) {
            var t = this.getModel("AttachmentType").Claimno,
                r = this.getOwnerComponent().getModel(),
                surll = "/ATTACH1Set",
                s = [],
                sListType = e;

            if(sclaimno !== undefined){
                t = sclaimno;
            }
            s.push(new Filter("Claimno", FilterOperator.EQ, t));
           

            var n = this;
            n.getView().setBusy(true);
            r.read(surll, {
                filters: s,
                success: function (e, t) {
                    n.getView().setBusy(false);                    
                    if (bflag !== '') {
                        n._OpenAttachmentDialog(e);
                    }
                },
                error: function (e, t) {
                    n.getView().setBusy(false)
                }
            })
        },
        onPressApprove: function (oEvt) {
            this.getView().getModel("LocalModel").setProperty("/decision", "AP");
            if (!this._DialogRemark) {
                this._DialogRemark = sap.ui.xmlfragment("zfiempclaimapp.fragment.remark", this);
                this.getView().addDependent(this._DialogRemark);
            };
            this._DialogRemark.open();
        },
        onPressReject: function (oEvt) {
            this.getView().getModel("LocalModel").setProperty("/decision", "RJ");
            if (!this._DialogRemark) {
                this._DialogRemark = sap.ui.xmlfragment("zfiempclaimapp.fragment.remark", this);
                this.getView().addDependent(this._DialogRemark);
            };
            this._DialogRemark.open();
        },
        onPressSendBack: function (oEvt) {
            this.getView().getModel("LocalModel").setProperty("/decision", "RE");
            if (!this._DialogRemark) {
                this._DialogRemark = sap.ui.xmlfragment("zfiempclaimapp.fragment.remark", this);
                this.getView().addDependent(this._DialogRemark);
            };
            this._DialogRemark.open();
        },
        onComments: function (oEvent) {

            if (this.getView().getModel("LocalModel").getProperty("/decision") === "AP") {
                if (this.getView().getModel("display").getData().results.Comments === "") {
                    MessageBox.error("Comment is mandatory");
                } else {
                    this.onpost("AP");
                }
            } else if (this.getView().getModel("LocalModel").getProperty("/decision") === 'RJ') {
                if (this.getView().getModel("display").getData().results.Comments === "") {
                    MessageBox.error("Comment is mandatory");
                } else {
                    this.onpost("RJ");
                }

            } 
            else if (this.getView().getModel("LocalModel").getProperty("/decision") === 'RE') {
                if (this.getView().getModel("display").getData().results.Comments === "") {
                    MessageBox.error("Comment is mandatory");
                } else {
                    this.onpost("RE");
                }

            } 

            this.getView().getModel("LocalModel").setProperty("/decision", "");
            this.getView().getModel("LocalModel").refresh();
            this._DialogRemark.close();
        },

        onCloseComments: function (oEvent) {
            this.getView().getModel("LocalModel").setProperty("/decision", "");
            this._DialogRemark.close();
        },
       
        onHandleCancelUpload1: function (e) {
            // this.readAllAttachmentData('', '');
             this._oAttachmentDialog.close();
          //  this._oAttachmentDialog.destroy();
         },
        _OpenAttachmentDialog: function (e) {

            var t = [],
                a = this.getModel("AttachmentType").Claimno,
                i = this.getOwnerComponent().getModel("UploadAttachmentModel"),
                r = {},
                sclaimno=this.getOwnerComponent().getModel("display").getData().results.Claimno,
                surl = '';
            i.setData([]);
            for (var o = 0; o < e.results.length; o++) {
                surl = "/sap/opu/odata/sap/ZFI_EMP_CLAIM_REQ_SRV/ATTACHSet(Claimno='" + e.results[o].Claimno + "',Zlevel=" + e.results[o].Zlevel + ",Serial=" + e.results[o].Serial + ")/$value";
                r = {
                    DocId: e.results[o].Serial,
                    FileName: e.results[o].FileName,
                    ProjectCode: "",
                    Mandt: "",
                    Mimetype: e.results[o].Mimetype,
                    Claimno: e.results[o].Claimno,
                    Serial: e.results[o].Serial,
                    UpldBy: e.results[o].UpldBy,
                    UpldDat: e.results[o].UpldDat,
                    UpldTime:e.results[o].UpldTime,
                    Uname: e.results[o].UpldBy,
                    Url: surl
                };
                t.push(r)
            }
            i.setData([]);
            i.setData({
                ATTACHSet: t
            });
            this.getView().setBusy(false);
            this._oAttachmentDialog.open()
        },
        getRouter: function () {
            return this.getOwnerComponent().getRouter()
        },
        getModel: function (e) {
            return this.getView().getModel(e)
        },
        setModel: function (e, t) {
            return this.getView().setModel(e, t)
        },
        showBusy: function (bBusy) {
            if (bBusy) {
                sap.ui.core.BusyIndicator.show(0);
            } else {
                sap.ui.core.BusyIndicator.hide();
            }
        },
        getText: function (sProperty, aArgs) {
            if (!this._oResourceBundle) {
                this._oResourceBundle = this.getModel("i18n").getResourceBundle();
            }
            return this._oResourceBundle.getText(sProperty, aArgs);
        },

        getResourceBundle: function (sText) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle()
        },
        onNavBack: function () {
            var e = t.getInstance().getPreviousHash(),
                n = sap.ushell.Container.getService("CrossApplicationNavigation");
            if (e !== undefined || !n.isInitialNavigation()) {
                history.go(-1)
            } else {
                this.getRouter().navTo("master", {}, true)
            }
        },

       
       

        onClosePO: function (oEvent) {
            //this.opo.close();
        },
        formatstatusapp: function (sText) {
            var sTxt = '';
            if (sText === '' || sText === 'SAVE' || sText === 'IN') {
                sTxt = 'In Process';
            } else if (sText === 'SUFA') {
                sTxt = 'Submitted for Approval';
            }
            else if (sText === 'AP') {
                sTxt = 'Approved';
                
            } else if (sText === 'RE') {
                sTxt = 'Reopen';
            }
            else if (sText === 'RJ') {
                sTxt = 'Rejected';
            }

            return sTxt;
        },
        timeformat: function (val) {
            if(val !== null){
            if (typeof val === 'string' || val instanceof String) {
                val = val.replace(/^PT/, '').replace(/S$/, '');
                val = val.replace('H', ':').replace('M', ':');

                var multipler = 60 * 60;
                var result = 0;
                val.split(':').forEach(function (token) {
                    result += token * multipler;
                    multipler = multipler / 60;
                });
                var timeinmiliseconds = result * 1000;

                var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
                    pattern: "KK:mm:ss a"
                });
                var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                return timeFormat.format(new Date(timeinmiliseconds + TZOffsetMs));
            } else {
                val = val.ms;
                var ms = val % 1000;
                val = (val - ms) / 1000;
                var secs = val % 60;
                val = (val - secs) / 60;
                var mins = val % 60;
                var hrs = (val - mins) / 60;

                return hrs + ':' + mins + ':' + secs;
            }
        }
        },
        DateFormatStr: function (oVal) {
            debugger;
            if(oVal !== null){
            if (typeof oVal === 'string' || oVal instanceof String) {
                return oVal.substr(8, 2) + "-" + oVal.substr(5, 2) + "-" + oVal.substr(0, 4);
            } else if (oVal instanceof Date) {
                var sDate = oVal.toJSON();
                return sDate.substr(8, 2) + "-" + sDate.substr(5, 2) + "-" + sDate.substr(0, 4);

            }
        }
        },
        getViewData: function (sValue) {
            var oFilter = new sap.ui.model.Filter("Claimno", sap.ui.model.FilterOperator.EQ, sValue);
            this.getOdata("/CLAIMREQSet(Claimno='" + sValue + "',Pernr='')","display", null);
            this.getOdata("/CRWFLOGSet","approvallog", oFilter);
          },
          getOdata: function (surl, smodelname, ofilter) {
            return new Promise((resolve, reject) => {
            if (ofilter === null) {
                this.showBusy(true);
                this.getOwnerComponent().getModel().read(surl, {
                    success: function (oData) {
                        this.showBusy(false);
                        if(oData.results !== undefined){
                            this.getModel(smodelname).setProperty("/results", oData.results);
                            resolve(oData.results);
                        }else{
                            this.getModel(smodelname).setProperty("/results", oData);
                            resolve(oData);
                        }
                        
                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg);                    
                        reject();
                    }.bind(this)
                });
            } else {
                this.showBusy(true);
                this.getOwnerComponent().getModel().read(surl, {
                    filters: [ofilter],
                    success: function (oData) {
                        this.showBusy(false);
                        if(oData.results !== undefined){
                            this.getModel(smodelname).setProperty("/results", oData.results);
                            resolve(oData.results);
                        }else{
                            this.getModel(smodelname).setProperty("/results", oData);
                            resolve(oData);
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                        var msg = JSON.parse(oError.responseText).error.message.value;
                        MessageBox.error(msg); 
                        reject();
                    }.bind(this)
                });
            }
        });
        },
        onpost:function(Status){
            this.showBusy(true);
            var oPayload = this.getOwnerComponent().getModel("display").getData().results;
            oPayload.Status = Status;
            this.Status = Status;
                this.getModel().create("/CLAIMREQSet", oPayload, {
                    method: "POST",
                    success: function (oData) {
                        this.showBusy(false);
                        debugger;
                        var sMsg = "Claim No." + oData.Claimno ;//+ " saved Successfully ";
                        if(this.Status === 'AP'){
                            sMsg = sMsg + " is approved";
                        }
                        else if(this.Status === 'RJ'){
                            sMsg = sMsg + " is rejected";
                        }
                        else if(this.Status === 'RE'){
                            sMsg = sMsg + " sent back";
                        }
                        
                        MessageBox.success(sMsg, {
                            actions: ["OK"],
                            onClose: (sAction) => {
                                if (sAction === "OK") {
                                    var sstr1 = {
                                        "editable": false
                                    }
                                    //asia
                                    this.getOwnerComponent().getModel("Header").setProperty("/data", sstr1);
                                }
                            },
                        });

                    }.bind(this),
                    error: function (oError) {
                        this.showBusy(false);
                    }.bind(this)
                });
        }
    })
});