var Store  = require('../../lib/store');
var State  = require('../state');
var Vector = require('../../lib/vector');

var Player = require('./player');
var Game   = require('./game');
var Blocks = require('./blocks');

var GameActions = require('../actions/game');

var World = Store.clone({
	_data: {
		gravity      : new Vector(0, 0.5),
		elevation    : 112,
		windowHeight : window.innerHeight,
		windowWidth  : window.innerWidth
	},

	update: function() {
		if (this.checkCollisions()) GameActions.lost();
	},

	checkCollisions: function() {
		var { location, width, height } = Player.get();
		var { x, y } = location;
		var blocks = Blocks.get('blocks');
		var scroll = Game.get('scroll');

		if (y > this.get('windowHeight') - this.get('elevation')) return true;

		for (var i = 0, len = blocks.length; i < len; i++) {
			var b = blocks[i];

			if (x + width < b.x - scroll)     continue;
			if (x > (b.x + b.width) - scroll) continue;
			if (y + height < b.y)             continue;
			if (y > b.y + b.height)           continue;

			return true;
		}
	}
});

State.register({
	GLOBAL_UPDATE: function() {
		World.update();
	}
});

module.exports = World;
