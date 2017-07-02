'use strict';

const GRID_COLOR = '#000';
const GRID_PATH = new Path2D("M0 0 H3 V3 H0 Z M1 0 V3 M2 0 V3 M0 1 H3 M0 2 H3 M0");
const SQUARE_PATH = new Path2D("M0 0 H1 V1 H0 Z");
const X_KEEPER = 1, Y_KEEPER = 3;
const drawGrid = function(/* CanvasRenderingContext2D */ ctx, /* String of [0-9] */ positions) /* number */ { // returns grid height ratio
  ctx.save(); {
  ctx.scale(1/4, 1/4); ctx.lineWidth = ctx.lineWidth * 4;
  ctx.strokeStyle = GRID_COLOR;
  ctx.stroke(GRID_PATH);
  ctx.save(); {
  ctx.translate(X_KEEPER, Y_KEEPER);
  ctx.stroke(SQUARE_PATH);
  } ctx.restore();

  ctx.fillStyle = GRID_COLOR;
  let pos, x, y;
  for (let idx in positions) {
    pos = positions[idx]-1;
    if (pos>=0) {
      x = pos%3;
      y = 2 - ~~(pos/3);
    } else {
      x = X_KEEPER;
      y = Y_KEEPER;
    }
    ctx.save(); {
    ctx.translate(x, y);
    ctx.fill(SQUARE_PATH);
    } ctx.restore();
  }
  } ctx.restore();
  return 4/3;
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
  img.src = imgUrl;
}

const textHeight = function(/* CanvasRenderingContext2D */ ctx, /* string */ text) {
  const textMeasure = ctx.measureText(text);
  return (textMeasure.actualBoundingBoxAscent + textMeasure.actualBoundingBoxDescent);
}

const textWidth = function(/* CanvasRenderingContext2D */ ctx, /* string */ text) {
  const textMeasure = ctx.measureText(text);
  return (textMeasure.width);
}

const bonusToString = function(/* number */ bonus) {
  if (bonus>0) return `+${bonus}`;
  else if (bonus<0) return `${bonus}`;
  else return "-";
}

module.exports.draw = function(/* CanvasRenderingContext2D */ ctx, params, cardDescription) {
  const MARGIN = params.margin;
  const INNER_MARGIN = params.innermargin;
  const GRID_OUTERSIZE = params.tophalfsize;
  const TEXT_PADDING = params.textpadding;
  const UTIL_WIDTH = ctx.canvas.width - 2*MARGIN;
  const UTIL_HEIGHT = ctx.canvas.height - 2*MARGIN;
  ctx.save(); {
  ctx.translate(MARGIN, MARGIN);

  // Positions grid
  ctx.save(); {
  ctx.scale(GRID_OUTERSIZE, GRID_OUTERSIZE); ctx.lineWidth = ctx.lineWidth / GRID_OUTERSIZE;
  drawGrid(ctx, cardDescription.positions);
  } ctx.restore();

  // Bonus
  const BONUS_WIDTH = UTIL_WIDTH / 2 / 3; // so that Att & Def are centered
  ctx.save(); {
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.font = `${params.fonts.style.bonusvalue} ${params.fonts.size.bonusvalue} ${params.fonts.family.sansserif}`;
  const MID_HEIGHT = textHeight(ctx, "X");
  ctx.translate(UTIL_WIDTH - BONUS_WIDTH/2, MID_HEIGHT);
  ctx.textBaseline = 'bottom';
  for (let idx in params.bonus) {
    const bonus = params.bonus[idx];
    if (typeof cardDescription.bonus[bonus.key] != "undefined")
      ctx.fillText(bonusToString(cardDescription.bonus[bonus.key]), (idx-3)*BONUS_WIDTH, 0);
  }
  ctx.font = `${params.fonts.style.bonuslabel} ${params.fonts.size.bonuslabel} ${params.fonts.sansserif}`;
  ctx.textBaseline = 'top';
  for (let idx in params.bonus) {
    const bonus = params.bonus[idx];
    if (typeof cardDescription.bonus[bonus.key] != "undefined")
      ctx.fillText(bonus.label, (idx-3)*BONUS_WIDTH, 0);
  }
  } ctx.restore();

  // Low half
  ctx.save(); {
  const LOW_Y = GRID_OUTERSIZE + INNER_MARGIN;
  ctx.translate(0, LOW_Y);
  const LOW_HEIGHT = UTIL_HEIGHT - LOW_Y;
  
  const LEFT_WIDTH = UTIL_WIDTH/3;
  //const LEFT_WIDTH = LOW_HEIGHT;
  const RIGHT_X = LEFT_WIDTH + INNER_MARGIN;
  const RIGHT_WIDTH = UTIL_WIDTH - RIGHT_X;

  // Picture
  drawImage(ctx, cardDescription.picture, LEFT_WIDTH, LOW_HEIGHT, true);

  // Low Right
  ctx.save(); {
  ctx.translate(RIGHT_X, 0);

  let h = 0;

  // Name
  ctx.font = `${params.fonts.style.name} ${params.fonts.size.name} ${params.fonts.family.serif}`;
  ctx.fillStyle = 'Black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(cardDescription.name, RIGHT_WIDTH/2, h);
  h += textHeight(ctx, cardDescription.name);
  h += textHeight(ctx, "")/2;

  // Specials
  ctx.font =  `${params.fonts.style.specials} ${params.fonts.size.specials} ${params.fonts.family.serif}`;
  ctx.textAlign = 'left';
  for (let idx = 0; idx<cardDescription.specials.length; idx++) {
    const special = cardDescription.specials[idx];
    ctx.fillText("• " + special, 0, h);
    h += textHeight(ctx, special);
  }

  // Description
  const descriptionLines = cardDescription.description.split('\n');
  ctx.font = `${params.fonts.style.description} ${params.fonts.size.description} ${params.fonts.family.sansserif}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  h = LOW_HEIGHT;
  for (let idx = descriptionLines.length-1; idx>=0; idx--) {
    const curLine = descriptionLines[idx];
    ctx.fillText(curLine, RIGHT_WIDTH, h);
    h -= textHeight(ctx, curLine)
  }

  } ctx.restore(); // Low Right

  } ctx.restore(); // Low half

  // Unique identifier
  ctx.font = `${params.fonts.style.id} ${params.fonts.size.id} ${params.fonts.family.sansserif}`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(cardDescription.id, UTIL_WIDTH-TEXT_PADDING, UTIL_HEIGHT+TEXT_PADDING);
  ctx.lineWidth = 0.5;
  ctx.strokeRect(UTIL_WIDTH, UTIL_HEIGHT, -textWidth(ctx, cardDescription.id)-2*TEXT_PADDING, textHeight(ctx, cardDescription.id)+2*TEXT_PADDING);

  } ctx.restore();
}
