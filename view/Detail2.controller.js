// sap.ui.controller("au.com.bpse.view.Detail2", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf au.com.bpse.view.Detail2
	 */
	//	onInit: function() {
	//
	//	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf au.com.bpse.view.Detail2
	 */
	//	onBeforeRendering: function() {
	//
	//	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf au.com.bpse.view.Detail2
	 */
	//	onAfterRendering: function() {
	//
	//	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf au.com.bpse.view.Detail2
	 
	//	onExit: function() {
	//
	//	}

});*/

sap.ui.core.mvc.Controller.extend("au.com.bpse.view.Detail", {

	onInit: function() {
		debugger;
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			//Do not wait for the master2 when in mobile phone resolution
			this.oInitialLoadFinishedDeferred.resolve();
		 } //else {
		// 	var oEventBus = this.getEventBus();
		// 	oEventBus.subscribe("Detail", "LoadFinished", this.onDetailLoaded, this);
		//}
		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
	},
	
	// onMasterLoaded: function(sChannel, sEvent, oData) {
	// 	if (oData.oListItem) {
	// 		this.bindView(oData.oListItem.getBindingContext().getPath());
	// 		this.oInitialLoadFinishedDeferred.resolve();
	// 	}
	// },
	
		onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();
		
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {

			// When navigating in the Detail page, update the binding context 
			if (oParameters.name === "detail2") {
				var sEntityPath = "/" + oParameters.arguments.entity;
				this.bindView(sEntityPath);
				
			} else {
				return;
			}
		}, this));
	},
	
		bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found
			var oData = oView.getModel().getData(sEntityPath);
			if (!oData) {
				this.showEmptyView();
				debugger;
				this.fireDetailNotFound();
			} else {
				this.fireDetailChanged(sEntityPath);
			}

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},
	
		showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "au.com.bpse.view.NotFound",
			targetViewType: "XML"
		});
	},
	
		fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("Detail2", "Changed", {
			sEntityPath: sEntityPath
		});
	},
	
		fireDetailNotFound: function() {
		this.getEventBus().publish("Detail2", "NotFound");
	},
	
		onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},
	
		onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail2", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1)
		}, true);
	},
	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onExit: function(oEvent) {
		this.getEventBus().unsubscribe("Master2", "LoadFinished", this.onMasterLoaded, this);
	}
	
});