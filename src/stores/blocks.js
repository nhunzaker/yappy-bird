var Store = require('../../lib/store')
var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
var ROWS = 40;
var COLS = 10;
var SCALEX = 500;
var SCALEY = HEIGHT / COLS;

var _data = {
	blocks : [],
	cols   : COLS,
	height : HEIGHT,
	map    : [],
	rows   : ROWS,
	scaleX : SCALEX,
	scaleY : SCALEY,
	width  : WIDTH
}

for (var i = 0; i < ROWS; i++) {
	var column = _data.map[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	var hole   = 1 + (Math.random() * 9) | 0;

	column[hole] = column[hole + 1] = column[hole - 1] = column[hole - 2] = 1;
};

for (var x = 0; x < ROWS; x++) for (var y = 0; y < COLS; y++) {
	if (_data.map[x][y] === 0) {
		_data.blocks.push([x * SCALEX, y * SCALEY, SCALEY, SCALEY]);
	}
}

var Blocks = Store.clone({
	get: function(key) {
		return key? _data[key] : _data;
	},

	totalWidth: function() {
		return ROWS * SCALEX + SCALEY;
	},

	closest: function(scroll) {
		var blocks = _data.blocks;
		var scaleY = _data.scaleY;
		var matches = [];
		var ent;

		for (var i = 0; i < blocks.length; i++) {
			ent = blocks[i];
			if (ent[0] >= scroll && ent[0] <= scroll + scaleY) {
				matches.push(ent);
			}
		}
		return matches;
	},

	checkCollision: function(scroll, y) {
		return Blocks.closest(scroll).reduce(function(memo, box) {
			var upper = box[1];
			var lower = box[1] + SCALEY;

			return memo || y > upper && y - 20 < lower;
		}, false);
	}
});

module.exports = Blocks;
