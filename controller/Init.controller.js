sap.ui.define([
    "app/scrapReport/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    'app/scrapReport/model/CustomerFormat',
    'app/scrapReport/model/InitPage'
    ], function(BaseController, MessageBox, Filter, CustomerFormat, InitPageUtil) {
       "use strict";
       
        return BaseController.extend("app.scrapReport.controller.Init",{
        		
        		// BEGIN OF INITIALIZE EVENT //
            	onInit: function() {
            		this.initCustomFormat();
            		var oDate = new Date();
            
		            this.byId("dpPeriodFrom").setDateValue(new Date(oDate.getFullYear(), oDate.getMonth(), 1));
		            this.byId("dpPeriodTo").setDateValue(new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0));
            
            	    var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
		            oVizFrame.setVizProperties({
		                plotArea: {
		                    dataLabel: {
		                        formatString:CustomerFormat.FIORI_LABEL_SHORTFORMAT_2,
		                        visible: true
		                    }
		                },
		                valueAxis: {
		                    label: {
		                        formatString: CustomerFormat.FIORI_LABEL_SHORTFORMAT_10
		                    },
		                    title: {
		                        visible: true
		                    }
		                },
		                categoryAxis: {
		                    title: {
		                        visible: true
		                    }
		                },
		                title: {
		                    visible: false,
		                    text: 'Scrap Report'
		                }
            		});
            		
            	

		        	InitPageUtil.initPageSettings(this.getView());
			        var oPopOver = this.getView().byId("idPopOver");
	        		oPopOver.connect(oVizFrame.getVizUid());
	        		oPopOver.setFormatString(CustomerFormat.FIORI_LABEL_FORMAT_2);
	            },
	            // END OF INITIALIZE EVENT //	
	            
	            initCustomFormat : function(){
            			CustomerFormat.registerCustomFormat();
        		},
    	        
    	        // BEGIN OF NAVIGATION BACK EVENT //
    	        
    	        onNavBack: function(){
	         		window.history.go(-1);
	        	},
	        	
	        	// END OF NAVIGATION BACK EVENT //		
	        		
    	        // BEGIN OF PLANT SERACH HELP //   
    	        
	        	fnPlantSearchHelp: function(oEvent){
	         		this.getView().setModel();
    				this.plantinputId = oEvent.getSource().getId();
    				if (!this._valueHelpDialogPlant) {
							this._valueHelpDialogPlant = sap.ui.xmlfragment(
							"app.scrapReport.view.Plant",
							this
							);
						this.getView().addDependent(this._valueHelpDialogPlant);
					}
						// open value help dialog filtered by the input value
						this._valueHelpDialogPlant.open();
	        	},
	        		
	        	fnCloseDialogPlant:function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
					if (oSelectedItem) {
						var mplantInput = this.getView().byId(this.plantinputId);
						mplantInput.setSelectedKey(oSelectedItem.getDescription());
					}
					oEvent.getSource().getBinding("items").filter([]);
					this._valueHelpDialogPlant.destroy(true);
					this._valueHelpDialogPlant =  false;
				},
					
				fnCancelDialogPlant:function() {
					this._valueHelpDialogPlant.destroy(true);
					this._valueHelpDialogPlant =  false;
				},
				
				fnhandleSearchPlant: function(oEvent) {
					var mValue = oEvent.getParameter("value");
					var oFilter = new Filter("Name1", sap.ui.model.FilterOperator.Contains,mValue);
					var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter([oFilter]);
				},	
				// END OF PLANT SERACH HELP //		

				// BEGIN OF COST CENTER GROUP SERACH HELP //	
				fnCCGSearchHelp:function(oEvent){
					var mPlantID = this.getView().byId("plant");
					if(mPlantID.getValue().trim().length === 0)
			            { MessageBox.error("Enter Plant !"); return false;}
			        else{
			        	this.getView().setModel();
	    				this.inputIdCCG = oEvent.getSource().getId();
		    				if (!this._valueHelpDialogCCG) {
									this._valueHelpDialogCCG = sap.ui.xmlfragment(
										"app.scrapReport.view.CostCenterGrp",
										this
									);
								this.getView().addDependent(this._valueHelpDialogCCG);
							}
						// open value help dialog filtered by the input value
						 var aFilter = [];
	    			     aFilter.push(new Filter("PlantID", sap.ui.model.FilterOperator.EQ, this.getView().byId("plant").getSelectedKey()));
	    			     sap.ui.getCore().byId("CCGPopup").getBinding("items").filter(aFilter);
						 this.getView().byId(this.inputIdCCG).getBinding("suggestionItems").filter(aFilter);
						 this._valueHelpDialogCCG.open();
			         }
				},
					
			    fnCloseDialogccg:function(oEvent) {
					var oSelectedItem = oEvent.getParameter("selectedItem");
						if (oSelectedItem) {
							var ccgInput = this.getView().byId(this.inputIdCCG);
							ccgInput.setSelectedKey(oSelectedItem.getDescription());
						}
						this._valueHelpDialogCCG.destroy(true);
						this._valueHelpDialogCCG =  false;
					},
				
				fnCancelDialogccg:function() {
					this._valueHelpDialogCCG.destroy(true);
					this._valueHelpDialogCCG =  false;
				},
				
				fnhandleSearchccg: function(oEvent) {
				    var sValue = oEvent.getParameter("value");
				    var mFilter = [];
    			     mFilter.push(new Filter("PlantID", sap.ui.model.FilterOperator.EQ, this.getView().byId("plant").getSelectedKey()));
    			     mFilter.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, sValue));
				 	 var oBinding = oEvent.getSource().getBinding("items");
						oBinding.filter(mFilter);
				},		
				// END OF COST CENTER GROUP SERACH HELP //
					
				// BEGIN OF SEARCH BUTTON //
				fnSearch:function(){
						
						var mPeriodFrom = this.getView().byId("dpPeriodFrom");
						var mPeriodTo = this.getView().byId("dpPeriodTo");
						
						 if(mPeriodFrom.getValue().trim().length === 0 || mPeriodTo.getValue().trim().length === 0)
			             { MessageBox.error("Posting date is empty !"); return false;}
			              else 
			             {
			             	 sap.ui.core.BusyIndicator.show();
							 jQuery.sap.delayedCall(1000, this, function () {
								 var mFilter = [];
		        			     mFilter.push(new Filter("PlantID", sap.ui.model.FilterOperator.EQ, this.getView().byId("plant").getSelectedKey()));
		        			     mFilter.push(new Filter("CostCentreGrp", sap.ui.model.FilterOperator.EQ, this.getView().byId("CCGRP").getSelectedKey()));
		        			     mFilter.push(new Filter("PostingDateFrom", sap.ui.model.FilterOperator.EQ, this.getView().byId("dpPeriodFrom").getValue()));
		        			     mFilter.push(new Filter("PostingDateTo", sap.ui.model.FilterOperator.EQ, this.getView().byId("dpPeriodTo").getValue()));
								 this.oVizFrame.getDataset().getBinding("data").filter(mFilter);
								 this.getModel().read("/ScrapAmountS", { 
									  success: this._onSuccess.bind(this),
									  error:this._onError.bind(this),
									  filters: mFilter
	    						});
							 });
			             }
					  
				},
				// END OF SEARCH BUTTON //
				
				// BEGIN OF SUCCESS MEESAGE  //
				_onSuccess: function(oData) {
            	    sap.ui.core.BusyIndicator.hide();
            	    var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(oData);
            	    this.oVizFrame.setModel(oModel);
    	        },
    	        // END OF SUCCESS MEESAGE  //
    	        
    	        // BEGIN OF ERROR MEESAGE  //
				_onError: function(oErr) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error(jQuery.parseJSON(oErr.responseText).error.message.value);
	            },	
				// END OF ERROR MEESAGE  //
				
				// BEGIN OF EXIT FUNCTION  //
    			onExit : function(){
    				this._valueHelpDialogPlant.destroy(true);
					this._valueHelpDialogPlant =  false;
					
					this._valueHelpDialogCCG.destroy(true);
					this._valueHelpDialogCCG =  false;
    			}
    			// END OF EXIT FUNCTION  //
        			
                      
        });
    });