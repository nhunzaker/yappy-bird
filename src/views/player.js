var Player      = require("../stores/player");
var imageLoader = require('../../lib/imageLoader');

var preload = imageLoader([
	'/assets/bird-01.png',
	'/assets/bird-02.png',
	'/assets/bird-03.png',
	'/assets/bird-04.png'
]);

module.exports = {
	frame    : 0,
	frames   : 3,
	interval : 100,
	then     : Date.now(),

	draw(ctx) {
		var { height, location, width } = Player.get();

		preload.then(function(images) {
			ctx.save();
			var now  = Date.now();

			if (now - this.then > this.interval) {
				this.frame = this.frame >= this.frames? 0 : this.frame + 1;
				this.then = now;
			}
			ctx.drawImage(images[this.frame], location.x, location.y);

			ctx.restore();
		}.bind(this));
	}
};
