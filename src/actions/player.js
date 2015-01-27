var Dispatcher = require('../dispatcher');

module.exports = {

	jump: function() {
		Dispatcher.dispatch('PLAYER_JUMP');
	}

};
