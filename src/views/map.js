var Blocks = require("../stores/blocks");
var Game   = require('../stores/game');

module.exports = {
  draw(ctx) {
    var { scroll } = Game.get();

    ctx.save();

    ctx.translate(-scroll, 0);

    ctx.lineWidth   = 2;
    ctx.fillStyle   = "#69BF4C";
    ctx.strokeStyle = "#543A46";

    Blocks.get('blocks').forEach(function(entity) {
      var { x, y, width, height } = entity;

      ctx.fillRect(x, y, width, height)
      ctx.strokeRect(x, y, width, height)
    });

    ctx.restore();
  }
};
