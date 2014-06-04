var World = require('../stores/world');
var Game = require('../stores/game');

var landLoaded = false;
var land = new Image();
land.onload = function() {
	landLoaded = true;
};
land.src = "assets/land.png";

module.exports = {
	draw(ctx, width, height) {
		if (!landLoaded) return;
		ctx.save();

		var elevation = World.get('elevation');

		ctx.save();
		ctx.translate(-Game.get('scroll'), height - elevation);

		var landPattern = ctx.createPattern(land, 'repeat');
		ctx.beginPath();
		ctx.rect(0, 0, width + Game.get('scroll'), elevation);
		ctx.fillStyle = landPattern;
		ctx.fill();
		ctx.restore();
	}
};
