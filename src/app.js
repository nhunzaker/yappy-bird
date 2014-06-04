var Game = require('./stores/game');
var Scene = require('./views/scene');
var State = require('./state');

require('./listeners/keyboard');
require('./listeners/microphone');

(function loop () {
	if (Game.get('playing') && !Game.get('lost')) State.dispatch('GLOBAL_UPDATE');
	requestAnimationFrame(loop);
}())
