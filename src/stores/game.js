var Store = require('../../lib/store')
var State = require('../state');

var _data = {
	playing : false,
	scroll  : -500
}

var Game = Store.clone({
	get: function(key) {
		return key? _data[key] : _data;
	},

	play: function() {
		Game.set("playing", true);
	},

	pause: function() {
		Game.set("playing", false);
	},

	update: function() {
		Game.set('scroll', Game.get('scroll') + 3);
	},

	set: function(key, value) {
		_data[key] = value;
		this.emitChange();
	}
});

State.register({
	GAME_PLAY: function() {
		Game.play();
	},

	GAME_PAUSE: function() {
		Game.pause();
	},

	GAME_UPDATE: function() {
		Game.update();
	}
});

module.exports = Game;
