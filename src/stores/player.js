var Store  = require('../../lib/store')
var State  = require('../state');
var Vector = require('../../lib/vector');

var gravity = new Vector(0, 0.15);

var Player = Store.clone({
	_data: {
		accel    : new Vector(0, 0),
		height   : 24,
		maxSpeed : 6,
		location : new Vector(100, window.innerHeight / 2),
		velocity : new Vector(0, 0),
		width    : 34
	},

	update: function() {
		var { accel, location, maxSpeed, velocity } = this._data;

		accel.add(gravity);

		velocity.add(accel);
		location.add(velocity);
		accel.mult(0);

		velocity.limit(maxSpeed);
	},

	jump: function() {
		var { velocity, accel } = this._data;

		velocity.y = Math.min(velocity.y, 0);

		accel.add(new Vector(0, -2))
	}
});

State.register({
	PLAYER_JUMP: function() {
		Player.jump();
	},

	GLOBAL_UPDATE: function() {
		Player.update();
	}
});

module.exports = Player;
