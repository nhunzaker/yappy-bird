var State = require('../state');

module.exports = {
	jump: function() {
		State.dispatch('PLAYER_JUMP');
	},
	update: function() {
		State.dispatch('PLAYER_UPDATE');
	}
};
