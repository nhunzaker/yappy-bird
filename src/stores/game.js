var Store = require('../../lib/store');
var State = require('../state');

var Game = Store.clone({
	_data: {
		playing : false,
		scroll  : 0
	},

	play() {
		Game.set('playing', true);
	},

	pause() {
		Game.set('playing', false);
	},

	toggle() {
		Game.set('playing', !Game.get('playing'));
	},

	update() {
		Game.set('scroll', Game.get('scroll') + 3);
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

	GAME_UPDATE() {
		Game.update();
	}
});

module.exports = Game;
