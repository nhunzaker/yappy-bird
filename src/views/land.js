var World = require('../stores/world');
var Game = require('../stores/game');
var imageLoader = require('../../lib/imageLoader');

var loaded = imageLoader('assets/land.png');

module.exports = {
	draw(ctx, width, height) {
		var elevation = World.get('elevation');

		loaded.then(function(image) {
			ctx.save();

			var pattern = ctx.createPattern(image, 'repeat');

			ctx.translate(-Game.get('scroll'), height - elevation);
			ctx.beginPath();
			ctx.rect(0, 0, width + Game.get('scroll'), image.height);
			ctx.fillStyle = pattern;
			ctx.fill();

			ctx.restore();
		});
	}
};
