var Store  = require('../../lib/store');
var State  = require('../state');
var Vector = require('../../lib/vector');

var Player = require('./player');
var Blocks = require('./blocks');

var Game = Store.clone({
	_data: {
		elevation    : 112,
		lost         : false,
		playing      : false,
		startTime    : Date.now(),
		scroll       : 0,
		windowHeight : window.innerHeight,
		windowWidth  : window.innerWidth
	},

	play() {
		Game.set('playing', true);
		Game.set('startTime', Date.now());
	},

	pause() {
		Game.set('playing', false);
	},

	toggle() {
		Game.set('playing', !Game.get('playing'));
	},

	update() {
		if (this.checkCollisions()) {
			Game.set('lost', Date.now());
		}

		var step = Math.max(3, (Date.now() - Game.get('startTime')) / 15000) | 0;

		Game.set('scroll', Game.get('scroll') + step);
	},

	checkCollisions: function() {
		var { location, width, height } = Player.get();
		var { x, y } = location;
		var blocks = Blocks.get('blocks');
		var { scroll, windowHeight, elevation } = this._data;

		if (y > windowHeight - elevation) return true;

		for (var i = 0, len = blocks.length; i < len; i++) {
			var b = blocks[i];

			if (x + width < b.x - scroll)     continue;
			if (x > (b.x + b.width) - scroll) continue;
			if (y + height < b.y)             continue;
			if (y > b.y + b.height)           continue;

			return true;
		}
	}
});

State.register({
	GAME_PLAY() {
		Game.play();
	},

	GAME_PAUSE() {
		Game.pause();
	},

	GAME_TOGGLE() {
		Game.toggle();
	},

	GLOBAL_UPDATE() {
		Game.update();
	}
});

module.exports = Game;
