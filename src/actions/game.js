var State = require('../state');

module.exports = {
	play: function() {
		State.dispatch('GAME_PLAY');
	},

	pause: function() {
		State.dispatch('GAME_PAUSE');
	},

	update: function() {
		State.dispatch('GAME_UPDATE');
	}
};
