var requestAnimationFrame = require('../../lib/requestAnimationFrame');

var Player = require('../stores/player');
var Game   = require('../stores/game');
var Blocks = require('../stores/blocks');

var PlayerActions = require('../actions/player');
var GameActions   = require('../actions/game');
var PlayerView    = require('./player');
var MapView       = require('./map');

var canvas    = document.getElementById('canvas');
var ctx       = canvas.getContext('2d');
canvas.width  = Blocks.get('width');
canvas.height = Blocks.get('height');

var Land = require('./land');
var Sky  = require('./sky');

function draw() {
	ctx.save();

	var { width, height } = canvas;
	var scroll = Game.get('scroll');

	ctx.clearRect(0, 0, width, height);

	Sky.draw(ctx);
	PlayerView.draw(ctx);
	MapView.draw(ctx, width, height);
	Land.draw(ctx, width, height);

	var isPlaying = Game.get('playing');
	var hasLost = Game.get('lost');

	if (!isPlaying || hasLost) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, width, height)

		ctx.font = "36pt Monospace";
		ctx.textAlign = "center";
		ctx.fillStyle = "#fff";
		ctx.fillText(hasLost ? "GAME OVER" : "PAUSED", width / 2, height / 2);
	}

	ctx.restore();
}

var frame = requestAnimationFrame(function loop() {
	frame = requestAnimationFrame(loop);
	draw();
});
