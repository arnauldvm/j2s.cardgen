'use strict';

const GRID_COLOR = '#000';
const GRID_PATH = new Path2D("M0 0 H3 V3 H0 Z M1 0 V3 M2 0 V3 M0 1 H3 M0 2 H3 M0");
const SQUARE_PATH = new Path2D("M0 0 H1 V1 H0 Z");
const X_KEEPER = 1, Y_KEEPER = 3;
const drawGrid = function(/* CanvasRenderingContext2D */ ctx, /* String of [0-9] */ positions) {
  ctx.save();
  ctx.scale(1/3, 1/3); ctx.lineWidth = ctx.lineWidth * 3;
  ctx.strokeStyle = GRID_COLOR;
  ctx.stroke(GRID_PATH);
  ctx.save();
  ctx.translate(X_KEEPER, Y_KEEPER);
  ctx.stroke(SQUARE_PATH);
  ctx.restore();

  ctx.fillStyle = GRID_COLOR;
  var pos, x, y;
  for (var idx in positions) {
    pos = positions[idx]-1;
    if (pos>=0) {
      x = pos%3;
      y = ~~(pos/3);
    } else {
      x = X_KEEPER;
      y = Y_KEEPER;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.fill(SQUARE_PATH);
    ctx.restore();
  }
  ctx.restore();
}

const MARGIN = 20;
const GRID_SIZE = 40;
module.exports.draw = function(/* CanvasRenderingContext2D */ ctx, cardDescription) {
  ctx.save();
  ctx.translate(MARGIN, MARGIN);

  // Positions grid
  ctx.save();
  ctx.scale(GRID_SIZE, GRID_SIZE); ctx.lineWidth = ctx.lineWidth / GRID_SIZE;
  drawGrid(ctx, cardDescription.positions);
  ctx.restore();

  ctx.restore();
}
