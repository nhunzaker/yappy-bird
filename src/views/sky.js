var World = require('../stores/world');

var skyLoaded = false;
var sky = new Image();
sky.onload = function() {
	skyLoaded = true;
};
sky.src = "assets/sky.png";

module.exports = {
	draw: function(ctx, width, height) {
		if (!skyLoaded) return;
		ctx.save();

		var elevation = World.get('elevation');

		ctx.save();
		ctx.translate(0, (height - elevation) - 109);

		var skyPattern = ctx.createPattern(sky, 'repeat');
		ctx.beginPath();
		ctx.rect(0, 0, width, 109);
		ctx.fillStyle = skyPattern;
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
};
