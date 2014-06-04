var Blocks = require("../stores/blocks");
var Game   = require('../stores/game');
var World  = require('../stores/world');

module.exports = {
	draw(ctx, width, height) {
		var elevation = World.get('elevation');
		var scroll = Game.get('scroll');
		ctx.save();

		ctx.translate(-scroll, 0);

		ctx.fillStyle = "#69BF4C";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#543A46";

		Blocks.get('blocks').forEach(function(entity) {
			var { x, y, width, height } = entity;

			if (World.get('debug')) {
				ctx.save();
				ctx.fillStyle = "#fff"
				ctx.font = "24px monospace";
				ctx.textAlign = 'center';
				ctx.fillText((x - scroll) + ',' + y, x + 15, y - 10);
				ctx.restore();
			}

			ctx.fillRect(x, y, width, height)
			ctx.strokeRect(x, y, width, height)
		});

		ctx.restore();
 	}
};
