var Blocks = require("../stores/blocks");
var Game   = require('../stores/game');
var World  = require('../stores/world');

module.exports = {
	draw(ctx, width, height) {
		var elevation = World.get('elevation');

		ctx.save();

		ctx.translate(-Game.get('scroll'), 0);

		ctx.fillStyle = "#69BF4C";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#543A46";

		Blocks.get('blocks').forEach(function(entity) {
			ctx.fillRect.apply(ctx, entity);
			ctx.strokeRect.apply(ctx, entity);
		});

		ctx.restore();
 	}
};
