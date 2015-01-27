var Game       = require('./stores/game');
var Scene      = require('./views/scene');
var Dispatcher = require('./dispatcher');

require('./listeners/keyboard');
require('./listeners/microphone');

(function loop () {
  if (Game.get('playing') && !Game.get('lost')) {
    Dispatcher.dispatch('GLOBAL_UPDATE');
  }

  requestAnimationFrame(loop);
}())
