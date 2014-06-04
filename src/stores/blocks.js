var Store  = require('../../lib/store');
var Player = require('./player');

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

var offset = 800;
var separation = 300;
var pipeWidth = 40;

for (var x = 0; x < ROWS; x++) {
	var opening = Math.random() * (HEIGHT / 2) | 0

	_data.blocks.push({
		height: opening,
		width: pipeWidth,
		x: offset + x * separation,
		y: 0
	});

	_data.blocks.push({
		height: HEIGHT - (opening + 200),
		width: pipeWidth,
		x: offset + x * separation,
		y: opening + 270
	});
}

var Blocks = Store.clone({
	_data: _data,

	totalWidth: function() {
		return ROWS * SCALEX + SCALEY;
	}
});

module.exports = Blocks;
