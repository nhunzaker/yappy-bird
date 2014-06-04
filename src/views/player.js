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
		var { location } = data;

		if (loaded) {
			ctx.drawImage(img, location.x - data.width, location.y);
		} else {
			ctx.fillStyle = data.color;
			ctx.fillRect(location.x - data.width, location.y, data.width, data.height);
		}
	}
};
