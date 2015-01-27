var Dispatcher = require('../dispatcher');

module.exports = {

	play() {
		Dispatcher.dispatch('GAME_PLAY');
	},

	pause() {
		Dispatcher.dispatch('GAME_PAUSE');
	},

	toggle() {
		Dispatcher.dispatch('GAME_TOGGLE');
	},

	lost() {
		Dispatcher.dispatch('GAME_LOST');
	}

};
