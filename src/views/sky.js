var Game   = require('../stores/game');
var imageLoader = require("../../lib/imageLoader");
var sky   = null;

imageLoader('assets/sky.png').then(function(image) {
	sky = image;
});

module.exports = {
	draw(ctx) {
		if (!sky) return;

		var { windowWidth, windowHeight } = Game.get();

		var elevation = Game.get('elevation');

		ctx.save();

		var pattern = ctx.createPattern(sky, 'repeat');

		ctx.translate(0, (windowHeight - elevation) - sky.height);
		ctx.beginPath();
		ctx.rect(0, 0, windowWidth, sky.height);
		ctx.fillStyle = pattern;
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}
};
