var BrickOpenHAB_item = require( './BrickOpenHAB_item.js' )

var BrickOpenHAB_Contact = function() {
	BrickOpenHAB_item.apply(this, []);
	return this;
}

BrickOpenHAB_Contact.prototype = Object.create( BrickOpenHAB_item.prototype );
BrickOpenHAB_Contact.prototype.constructor	= BrickOpenHAB_Contact;
BrickOpenHAB_Contact.prototype.getTypeName 	= function() {return "BrickOpenHAB_Contact";}
var types = BrickOpenHAB_item.prototype.getTypes();
types.push	( BrickOpenHAB_Contact.prototype.getTypeName()
			, BrickOpenHAB_item.types.OpenClosed
			);
BrickOpenHAB_Contact.prototype.getTypes		= function() {return types;}

BrickOpenHAB_Contact.prototype.registerType(BrickOpenHAB_Contact.prototype.getTypeName(), BrickOpenHAB_Contact.prototype);

BrickOpenHAB_Contact.prototype.update	= function(topic, operation, message) {
	BrickOpenHAB_item.prototype.update.apply(this, [topic, operation, message]);
	return this;
}

module.exports = BrickOpenHAB_Contact;