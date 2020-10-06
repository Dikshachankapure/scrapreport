sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/odata/ODataModel"
	], function (Controller, ODataModel) {
		"use strict";

		return Controller.extend("app.scrapReport.controller.BaseController", {
			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
			        return this.getView().getModel(sName);    
			},
			
			getModelUrl : function () {
			    return "/sap/opu/odata/SAP/ZGTPPF110_SRV/";
			},
		
			error: function(oError) {

		    var sMessage;
		    var sDetails;
		    if (oError.hasOwnProperty("customMessage")) {
			     sMessage = oError.customMessage.message;
			     sDetails = oError.customMessage.details;
		    } else {
		     if (oError.response && oError.response.statusCode === 0) {
		    	sMessage = "Connection Error";
		     } else {
		    	sMessage = "Http Request Failed";
		     }
		     if (oError.response && oError.response.body !== "" && oError.response.statusCode === 400) {
		      var oParsedError = JSON.parse(oError.response.body);
		      sDetails = oParsedError.error.message.value;
		     } else {
		      sDetails = oError.response ? oError.response.body : null;
		     }
		    }
		    sap.m.MessageBox.show(sMessage, {
		     title: "ERROR",
		     icon: sap.m.MessageBox.Icon.ERROR,
		     actions: [sap.m.MessageBox.Action.OK],
		     details: sDetails,
		     styleClass: "sapUiSizeCompact"
		    });
		
		   },
			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},
			
		
			/**
			 * Getter for the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			}

		});

	}
);