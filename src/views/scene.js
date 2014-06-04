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

function draw() {
	ctx.save();

	var isBlocking = Blocks.checkCollision(Game.get('scroll'), Player.get('y'));
	var scroll     = Game.get('scroll');

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	PlayerView.draw(ctx);
	MapView.draw(ctx);

	if (isBlocking) GameActions.pause();

	ctx.restore();
}

var frame = requestAnimationFrame(function loop() {
	frame = requestAnimationFrame(loop);
	draw();
});
