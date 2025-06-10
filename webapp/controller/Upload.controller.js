sap.ui.define([
    "zfiempclaimapp/controller/BaseController",
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    "sap/m/UploadCollectionParameter",
    "sap/ui/model/json/JSONModel",
    "zfiempclaimapp/model/formatter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/PDFViewer",
    "zfiempclaimapp/lib/jszip", 
    "zfiempclaimapp/lib/xlsx",
	'sap/ui/export/Spreadsheet'
], function (BaseController, Filter, FilterOperator, UploadCollectionParameter, JSONModel, formatter, MessageBox, MessageToast, o,jszip,xlsx,Spreadsheet) {
    "use strict";
    var editMode = false;
    var EdmType = sap.ui.export.EdmType;
    return BaseController.extend("zfiempclaimapp.controller.Upload", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                              u             */
        /* =========================================================== */

        onInit: function () {
            var oViewModel = new JSONModel({
                busy: false,
                delay: 0
            });

            this._pdfViewer = new o;
            this.getView().addDependent(this._pdfViewer);

            this.getRouter().getRoute("upload").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "detailView");
        //    this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
            this._oODataModel = this.getOwnerComponent().getModel();
            this._oResourceBundle = this.getResourceBundle();
            //	console.log(oODataModel);
        },
        _onObjectMatched: function (oEvent) {
            //	this.showBusy(true);
           
            this._bindView();
        },
        _bindView: function () {
            // Set busy indicator during view binding

          //  this.getItemData(sClaimno, sLotNo);
        },

        oncancelupload: function(e){
            window.location.reload(true);
        },

        JSONToCSVConvertor : function(JSONData, ReportTitle, ShowLabel) {
            var CSV = "";var arrData = JSONData;
            
               // Set Report title in first row or line
            
        //    CSV+= ReportTitle + '\r\n\n';
            
                         if (ShowLabel) {
            
                                var row = ""; 
                 //row+= 'Ref No,Ref No.,Insurance/Order Type,Proceeding on emergency leave,Inter-company transfer,Newly Recruited,Inter-departmental transfer,Invoice Cost,Transfer To (Remarks),Message';
            
                 row+= 'Ref No.,File No.,Proceeding on vacation,Proceeding on emergency leave,Inter-company transfer,Newly Recruited,Inter-departmental transfer,Department/Site,Transfer To (Remarks),Last working Day';


                              CSV+= row + '\r\n';
            
                         }
            
                         //loop is to extract each row
                         if(arrData !== undefined){
                        //  for (var i = 0; i <arrData.length; i++) {
            
                        //         var row = "";
            
                        //       row+= '"' + arrData[i].Equnr + ' ","' + arrData[i].Claimno + '","' + arrData[i].Ilart + '","' 
                        //                 + arrData[i].InsType + ' ","' + arrData[i].Gstrp + '","' + arrData[i].Gltrp + ' ","'
                        //                 + arrData[i].InvDate + ' ","' + arrData[i].InvAmount + ' ","' + arrData[i].RegNo + ' ","'
                        //                 + arrData[i].Remarks + ' ","' + arrData[i].PoNumber + ' ","' + arrData[i].PoItem + ' ","'
                        //                 + arrData[i].Name1 + ' ","' + arrData[i].Claims + ' ","' + arrData[i].Message +'",';
            
                        //       row.slice(0,row.length - 1);
            
                        //         CSV+= row + '\r\n';
            
                        //  }
                        }
            
                         if (CSV == "") {
            
                      alert("Invalid data");
            
                                return;
            
                         }
            
                         // Generate a file name
            
                         var fileName = ReportTitle;
            
                         // Initialize file format you want csv or xls
            
                         var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
            
                         // Now the little tricky part.
            
                         // you can use either>> window.open(uri);
            
                         // but this will not work in some browsers
            
                         // or you will not get the correct file extension
            
                         // this trick will generate a temp <a /> tag
            
                         var link =document.createElement("a");
            
                   link.href= uri;
            
                         // set the visibility hidden so it will not effect on your web layout
            
                   link.style= "visibility:hidden";
            
                   link.download= fileName + ".csv";
            
            // this part will append the anchor tag and remove it after automatic
            
              // click
            
                         document.body.appendChild(link);
            
                         link.click();
            
                         document.body.removeChild(link);
            
                   },

        onExport: function () {
            var odata = this.getView().getModel("ExportModel").getData().data;
            this.JSONToCSVConvertor(odata, "DOA Mass Upload", true);
        },
        createColumnConfig: function() {
            var aCols = [];
            aCols.push({
                label: 'Ref No',
                property: 'Equnr',
                type: EdmType.String
            });

            aCols.push({
                label: 'File No.',
                type: EdmType.String,
                property: 'Claimno',
                //scale: 0
            });

            aCols.push({
                label: 'Insurance/Order Type',
                type: EdmType.String,
                property: 'Ilart',
            });

            aCols.push({
                label: 'Proceeding on emergency leave',
                type: EdmType.String,
                property: 'InsType',
            });

            aCols.push({
                label: 'Inter-company transfer',
                type: EdmType.Date,
                property: 'Gstrp',
            });

            aCols.push({
                label: 'Newly Recruited',
                type: EdmType.Date,
                property: 'Gltrp',
            });

            aCols.push({
                label: 'Inter-departmental transfer',
                type: EdmType.Date,
                property: 'InvDate',
            });

            aCols.push({
                label: 'Invoice Cost',
                type: EdmType.String,
                property: 'InvAmount',
            });

            aCols.push({
                label: 'Transfer To (Remarks)',
                type: EdmType.String,
                property: 'RegNo',
            });

            aCols.push({
                label: 'Remarks',
                type: EdmType.String,
                property: 'Remarks',    
            });

            aCols.push({
                label: 'PO No',
                type: EdmType.String,
                property: 'PoNumber',
            });

            aCols.push({
                label: 'PO Item',
                type: EdmType.String,
                property: 'PoItem',
            });

            aCols.push({
                label: 'Insurance Company Name',
                type: EdmType.String,
                property: 'Name1',
            });

            aCols.push({
                label: 'Value of Insured Vehicle/Claim/Accident',
                type: EdmType.String,
                property: 'Claims',
            });

            aCols.push({
                label: 'Message',
                type: EdmType.String,
                property: 'Message',
            });


            return aCols;
        },
        onUpload: function(e) {
                
            this._import(e.getParameter("files") && e.getParameter("files")[0])
        },
        _import: function(e) {
            var t = this;
            var o = {};
            var sVal = {};
            if (e && window.FileReader) {
                var a = new FileReader;
               
                a.onload = function(e) {
                    var a = e.target.result;
                    var r = XLSX.read(a, {
                        type: "binary"
                    });
                    r.SheetNames.forEach(function(e) {
                        o = XLSX.utils.sheet_to_row_object_array(r.Sheets[e])
                    });
                    var oArr = {}; 
                    var oFinalArr = [];
                    for (var s = 0; s < o.length; s++) {
                       // if (s > 0) {
                        //    oArr = Object.assign({}, this.getOwnerComponent().getModel("TableModel").getData().results[0]);
                            var sCol = o[s];
                            if (sCol['Ref No.'] !== undefined) {
                                oArr.Claimno = sCol['Ref No.'];
                            }

                            if (sCol['File No.'] !== undefined) {
                                oArr.EmpNo = sCol['File No.'];
                            }
                            
                            if (sCol['Proceeding on vacation'] !== undefined) {                              

                             oArr.ProcdVac = sCol['Proceeding on vacation'];
                                }
                            if (sCol['Proceeding on emergency leave'] !== undefined) {
                                oArr.ProcdEmer = sCol['Proceeding on emergency leave'];
                            }
                            if (sCol['Inter-company transfer'] !== undefined) {
                                oArr.IcTrans = sCol['Inter-company transfer'];
                            }
                            if (sCol['Newly Recruited'] !== undefined) {
                                oArr.NewRec = sCol['Newly Recruited'];
                            }
                            if (sCol['Inter-departmental transfer'] !== undefined) {
                                oArr.IdTrans = sCol['Inter-departmental transfer'];
                            }
                            if (sCol['Department/Site'] !== undefined) {
                                oArr.DepartmentSite = sCol['Department/Site'];
                            }
                            if (sCol['Transfer To (Remarks)'] !== undefined) {
                                oArr.TransRem = sCol['Transfer To (Remarks)'];
                            }
                            if (sCol['Last working Day'] !== undefined) {
                                oArr.LastWDay =  this.ondateFormat(sCol['Last working Day']);
                            }
                            
                            
                            
                           // oArr.Message = oArr.RentalObj;
                            delete oArr.__metadata;
                            oFinalArr.push(oArr);
                        // }
                    }
                   
                    var oPayload = {
                        "Claimno":"0",
                        //flData:oFinalArr 
                        header_to_empdetails:oFinalArr
                    };
                    this.showBusy(true);
                    this.getModel().create("/CLAIMREQSet", oPayload, {
                        method: "POST",
                        success: function (oData) {
                           this.showBusy(false);
                          // this.getView().getModel("TableModel").setProperty("/data", oData.flData.results);
                           this.getView().getModel("TableModel").setProperty("/data", oData.header_to_empdetails.results);
                        }.bind(this),
                        error: function (oError) {
                            this.showBusy(false);
                        }.bind(this)
                    });
                }.bind(this);
                a.onerror = function (e) {
                    alert(e)
                };
                a.readAsBinaryString(e)
            }
        },
        ondateFormat(sInput)
        {

            // date taking first 2 as month, second 2 as day, so making it correct(c) here

            var sday_c = sInput.substring(0,2);
             var smonth_c = sInput.substring(5,3);
             var syear_c = sInput.substring(10,6);
             var sdate = smonth_c+"."+sday_c+"."+syear_c;



          var date = new Date(),
            idate = new Date(sdate),
            month = '' + (idate.getMonth() + 1),
            day = '' + idate.getDate(),
            year = idate.getFullYear();

            if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

           date = [month, day, year].join('.');

          // new Date(date);
           
           var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "yyyy-MM-dd"
            });

        var oDate = dateFormat.format(new Date(date));
        oDate  = oDate  + 'T11:59:59';
        oDate = new Date(oDate);

        return oDate;   

        },
        formatDate: function (dt) {
			if (dt === undefined || dt === null || dt === "") {
				return;
			}
			var date = new Date(dt),
				month = '' + (dt.getMonth() + 1),
				day = '' + dt.getDate(),
				year = dt.getFullYear();
			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;
			return [day, month, year].join('.');
		},
    });


});