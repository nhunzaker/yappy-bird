var Blocks = require("../stores/blocks");
var Game   = require('../stores/game');

var cache    = document.createElement('canvas');
cache.height = Blocks.get('height');
cache.width  = Blocks.totalWidth();

module.exports = {
	isCached: false,

	cache: function() {
		var ctx = cache.getContext('2d');

		ctx.clearRect(0, 0, cache.width, cache.height);
		ctx.fillStyle = "#69BF4C";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#543A46";

		Blocks.get('blocks').forEach(function(entity) {
			ctx.fillRect.apply(ctx, entity);
			ctx.strokeRect.apply(ctx, entity);
		});

		this.isCached = true;
	},

	draw: function(ctx) {
		if (!this.isCached) this.cache();
		ctx.drawImage(cache, -Game.get('scroll'), 0);
	}
}
