var World = require('../stores/world');

var loaded = imageLoader('assets/land.png');

module.exports = {
	draw: function(ctx, width, height) {
		var elevation = World.get('elevation');

		loaded.then(function(image) {
			ctx.save();
			ctx.translate(0, (height - elevation) - image.height);

			var pattern = ctx.createPattern(image, 'repeat');

			ctx.beginPath();
			ctx.rect(0, 0, width, sky.height);
			ctx.fillStyle = pattern;
			ctx.fill();
			ctx.closePath();

			ctx.restore();
		});
	}
};
