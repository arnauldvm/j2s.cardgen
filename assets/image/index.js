'use strict';

const context = require('../context');

module.exports.draw = function(/* CanvasRenderingContext2D */ ctx, /* string */ imgUrl, width, height, /* boolean */ hasBorder, /* boolean */ keepRatio, callback) {
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
    if (keepRatio) {
        if (imgRatio>targetRatio) {
            w = height/imgRatio;
            x = (width-w)/2;
        } else {
            h = width*imgRatio;
            y = (height-h)/2;
        }
    }
    ctx.drawImage(img, x, y, w, h);
    if (hasBorder) ctx.strokeRect(0, 0, width, height);
    saveContext.restoreIn(ctx);
    if (callback) callback();
  }, false);
  img.src = imgUrl;
}
