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
  let pos, x, y;
  for (let idx in positions) {
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

const context = require('../context');

const drawImage = function(/* CanvasRenderingContext2D */ ctx, /* string */ imgUrl, width, height, /* boolean */ hasBorder) {
  // (saving the context, since it will likely have changed by the time the image is actually drawn
  //  (because of async loading))
  const curContext = new context.SavedContext(ctx);
  const img = new Image();
  img.addEventListener('load', function() {
    const saveContext = new context.SavedContext(ctx);
    curContext.restoreIn(ctx);
    const imgRatio = img.height/img.width;
    const targetRatio = height/width;
    let x = 0;
    let y = 0;
    let w = width;
    let h = height;
    if (imgRatio>targetRatio) {
      w = height/imgRatio;
      x = (width-w)/2;
    } else {
      h = width*imgRatio;
      y = (height-h)/2;
    }
    ctx.drawImage(img, x, y, w, h);
    if (hasBorder) ctx.strokeRect(0, 0, width, height);
    saveContext.restoreIn(ctx);
  }, false);
  img.src = cardDescription.picture;
}

const MARGIN = 20;
const INNER_MARGIN = 10;
const GRID_SIZE = 40;
module.exports.draw = function(/* CanvasRenderingContext2D */ ctx, cardDescription) {
  const UTIL_WIDTH = ctx.canvas.width - 2*MARGIN;
  const UTIL_HEIGHT = ctx.canvas.height - 2*MARGIN;
  ctx.save();
  ctx.translate(MARGIN, MARGIN);

  // Positions grid
  ctx.save();
  ctx.scale(GRID_SIZE, GRID_SIZE); ctx.lineWidth = ctx.lineWidth / GRID_SIZE;
  drawGrid(ctx, cardDescription.positions);
  ctx.restore();

  // Low half
  const LOW_Y = UTIL_HEIGHT/2;
  ctx.translate(0, LOW_Y);
  const LOW_HEIGHT = UTIL_HEIGHT - LOW_Y;
  
  const LEFT_WIDTH = UTIL_WIDTH/3;
  //const LEFT_WIDTH = LOW_HEIGHT;
  const RIGHT_X = LEFT_WIDTH + INNER_MARGIN;
  const RIGHT_WIDTH = UTIL_WIDTH - RIGHT_X;

  // Picture
  drawImage(ctx, cardDescription.picture, LEFT_WIDTH, LOW_HEIGHT, true);

  // Low Right
  ctx.translate(RIGHT_X, 0);

  // Name
  ctx.font = 'bold 18px Times New Roman serif';
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(cardDescription.name, RIGHT_WIDTH/2, 0);


  ctx.restore();
}
