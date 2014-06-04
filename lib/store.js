var Emitter = require("events").EventEmitter;
var merge   = require('react/lib/merge');
var CHANGE  = 'change';

var Store = merge(Emitter.prototype, {
	CHANGE: CHANGE,

	get(key) {
		return key? this._data[key] : this._data;
	},

	set(key, value) {
		this._data[key] = value;
		this.emitChange();
	},

	clone(props) {
		return merge(props, this);
	},

	emitChange(type, payload) {
		this.emit(CHANGE, type, payload);
	},

	onChange(callback) {
		this.on(CHANGE, callback);
	},

	offChange(callback) {
		this.removeListener(CHANGE, callback);
	}
});

module.exports = Store;
