var paymayaSdk = require("./../../lib/paymaya/PaymayaSDK");
var Checkout = require("./../../lib/paymaya/api/Checkout");
var Customization = require("./../../lib/paymaya/api/Customization");
var Item = require("./../../lib/paymaya/model/checkout/Item");
var ItemAmount = require("./../../lib/paymaya/model/checkout/ItemAmount");
var ItemAmountDetails = require("./../../lib/paymaya/model/checkout/ItemAmountDetails");
var User = require("./User");

(function() {
	
	// Initialize Paymaya SDK with Checkout API key and environment(SANDBOX or PRODUCTION)
	paymayaSdk.initCheckout("pk-iaioBC2pbY6d3BVRSebsJxghSHeJDW4n6navI7tYdrN", paymayaSdk.ENVIRONMENT.SANDBOX);

	// Contruct item amount details
	var itemAmountDetails = _getItemAmountDetails();

	// Construct item amount
	var itemAmount = _getItemAmount(itemAmountDetails);

	// Contruct item
	var item = _getItem(itemAmount, itemAmount);

	// Construct buyer object
	var user = new User();
	var buyer = user.getBuyer();

	// Contruct item list
	var items = [];
	items.push(item);

	// Initialize Checkout
	var checkout = new Checkout();
	_executeInitiateCheckout(checkout, buyer, items, itemAmount);

})();

function _executeInitiateCheckout(checkout, buyer, items, itemAmount) {
	var checkoutOptions = {
		buyer: buyer,
		items: items,
		totalAmount: itemAmount,
		requestReferenceNumber: "123456789"
	}
	var onInitiateCheckout = function(err, response) {
		if(err) {
			console.log("Error: " + err);
			return;
		}
		console.log("checkoutId: " + response.checkoutId);
		console.log("redirectUrl: " + response.redirectUrl);

		_executeGetCheckout(checkout, response.checkoutId);
	}
	console.log("\nInitiating Checkout Api");
	checkout.executeInitiateCheckout(checkoutOptions, onInitiateCheckout);
}

function _executeGetCheckout(checkout, checkoutId) {
	var onRetrieveCheckout = function(err, response) {
		if(err) {
			console.log("Error: " + err);
			//return;
		}
		if(response) {
			console.log("response: " + response);
		}

		// Initialize Customization
		var customization = new Customization();
		_executeSetCustomization(customization);
	}
	console.log("\nRetrieving Checkout Api");
	checkout.executeRetrieveCheckout(checkoutId, onRetrieveCheckout);
}

function _executeSetCustomization(customization) {
	var customizationOptions = {
	    "logoUrl": "https://cdn.paymaya.com/production/checkout_api/customization_example/yourlogo.svg",
	    "iconUrl": "https://cdn.paymaya.com/production/checkout_api/customization_example/youricon.ico",
	    "appleTouchIconUrl": "https://cdn.paymaya.com/production/checkout_api/customization_example/youricon_ios.ico",
	    "customTitle": "Checkout Page Title",
	    "colorScheme": "#368d5c"
	}

	var onSetCustomization = function(err, response) {
		if(err) {
			console.log("Error: " + err);
			//return;
		}
		if(response) {
			console.log("response: " + response);
		}
	}
	console.log("\nSet Customization Api");
	customization.executeSetCustomization(customizationOptions, onSetCustomization);
}

function _getItemAmountDetails() {
	var itemAmountDetailsOptions = {
		shippingFee: "14.00",
		tax: "5.00",
		subTotal: "50.00" 
	}
	return new ItemAmountDetails(itemAmountDetailsOptions);
}

function _getItemAmount(itemAmountDetails) {
	var itemAmountOptions = {
		currency: "PHP",
		value: "69.00",
		details: itemAmountDetails
	}
	return new ItemAmount(itemAmountOptions);
}

function _getItem(amount, totalAmount) {
	var itemOptions = {
		name: "Leather Belt",
		code: "pm_belt",
		description: "Medium-sv",
		amount: amount,
		totalAmount: totalAmount
	}
	return new Item(itemOptions);
}