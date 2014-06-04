var Player = require("../stores/player");
var loaded = false;

var img = new Image();
img.onload = function() {
	loaded = true;
}
img.src = '/assets/bird.png';

module.exports = {
	draw: function(ctx) {
		var data = Player.get();

		if (loaded) {
			ctx.drawImage(img, data.x - data.width, data.y, 68, 48);
		} else {
			ctx.fillStyle = data.color;
			ctx.fillRect(data.x - data.width, data.y, data.width, data.height);
		}
	}
};
