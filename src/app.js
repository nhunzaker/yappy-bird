var Game          = require('./stores/game');
var Scene         = require('./views/scene');
var PlayerActions = require('./actions/player');
var GameActions   = require('./actions/game');

require('./recorder');

requestAnimationFrame(function loop () {
	if (Game.get('playing')) {
		PlayerActions.update();
		GameActions.update();
	}

	requestAnimationFrame(loop);
});
