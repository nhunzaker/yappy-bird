var Store  = require('../../lib/store');
var State  = require('../state');
var Vector = require('../../lib/vector');

var World = Store.clone({
	_data: {
		gravity       : new Vector(0, 0.5),
		elevation     : 112
	}
});

State.register({});

module.exports = World;
