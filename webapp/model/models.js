sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (e, n) {
	"use strict";
	return {
		createDeviceModel: function () {
			var t = new e(n);
			t.setDefaultBindingMode("OneWay");
			return t
		},
		createFLPModel: function () {
			var n = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				t = n ? n().isJamActive() : false,
				i = new e({
					isShareInJamActive: t
				});
			i.setDefaultBindingMode("OneWay");
			return i
		}
	}
});