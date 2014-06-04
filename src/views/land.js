var Game   = require('../stores/game');
var imageLoader = require("../../lib/imageLoader");
var land   = null;

imageLoader('assets/land.png').then(function(image) {
	land = image;
});

module.exports = {
	draw(ctx, width, height) {
		if (!land) return;

		var { elevation, scroll } = Game.get();

		ctx.save();

		var pattern = ctx.createPattern(land, 'repeat');

		ctx.translate(-scroll, height - elevation);
		ctx.beginPath();
		ctx.rect(0, 0, width + scroll, land.height);
		ctx.fillStyle = pattern;
		ctx.fill();
		ctx.restore();
	}
};
