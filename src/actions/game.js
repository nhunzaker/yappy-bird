var State = require('../state');

module.exports = {
	play() {
		State.dispatch('GAME_PLAY');
	},

	pause() {
		State.dispatch('GAME_PAUSE');
	},

	toggle() {
		State.dispatch('GAME_TOGGLE');
	},

	lost() {
		State.dispatch('GAME_LOST');
	}
};
