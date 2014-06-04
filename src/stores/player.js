var Store = require('../../lib/store')
var State = require('../state');

var _data = {
	color: "#cc3333",
	height: 20,
	width: 20,
	ay: 0,
	speed: 0,
	x: 100,
	y: window.innerHeight / 2
}

var truncate = function(n, min, max) {
	return Math.max(min, Math.min(n, max))
}

var Player = Store.clone({
	get: function(key) {
		return key? _data[key] : _data;
	},

	update: function() {
		var y     = this.get('y');
		var ay    = this.get('ay');
		var speed = this.get('speed');

		ay += 0.08;

		speed = truncate(speed + ay, -5, 10);

		this.set('speed', speed);
		this.set('ay', ay);
		this.set('y', this.get('y') + speed);
	},

	jump: function() {
		this.set('ay', -1);
	},

	set: function(key, value) {
		_data[key] = value;
		this.emitChange();
	}
});

State.register({
	PLAYER_JUMP: function() {
		Player.jump();
	},

	PLAYER_UPDATE: function() {
		Player.update();
	}
});

module.exports = Player;
