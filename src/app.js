var Game = require('./stores/game');
var Scene = require('./views/scene');
var State = require('./state');
var World = require('./stores/world');

require('./listeners/keyboard');
//require('./listeners/microphone');

(function loop () {
	if (Game.get('playing') && !Game.get('hasLost')) State.dispatch('GLOBAL_UPDATE');
	requestAnimationFrame(loop);
}())
