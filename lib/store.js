var Emitter = require("events").EventEmitter;
var merge   = require('react/lib/merge');
var CHANGE  = 'change';

var Store = merge(Emitter.prototype, {
	CHANGE: CHANGE,

	clone: function(props) {
		return merge(props, this);
	},

	emitChange: function(type, payload) {
		this.emit(CHANGE, type, payload);
	},

	onChange: function(callback) {
		this.on(CHANGE, callback);
	},

	offChange:function (callback) {
		this.removeListener(CHANGE, callback);
	}
});

module.exports = Store;
