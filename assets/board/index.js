'use strict';

module.exports.draw = function(/* CanvasRenderingContext2D */ ctx, params, boardDescription) {
    const CARD_WIDTH = params.cardsize.width;
    const CARD_HEIGHT = params.cardsize.height;
    const STEP_X = CARD_WIDTH + params.innermargin;
    const STEP_Y = 2*CARD_HEIGHT + params.spacing + params.innermargin;
    ctx.save(); {
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'round';
        ctx.font = params.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(params.resolution.width/2, params.resolution.height/2);
        for (let half=0; half<2; half++) {
            boardDescription.cards.forEach((card) => {
                ctx.save(); {
                    // move to center
                    ctx.translate(card.position.x*STEP_X, -card.position.y*STEP_Y);
                    if (card.position.y>-2) {
                        ctx.translate(0, (params.spacing+CARD_HEIGHT)/2);
                    } else {
                        ctx.translate(0, -(params.spacing+CARD_HEIGHT)/2);
                    }
console.log(params.colors[half]);
                    ctx.beginPath()
                    ctx.fillStyle = params.colors[half];
                    ctx.rect(-CARD_WIDTH/2, -CARD_HEIGHT/2, CARD_WIDTH, CARD_HEIGHT);
                    ctx.fill();
                    ctx.stroke();
                    ctx.fillStyle = 'black';
                    ctx.fillText(card.label, 0, 0);
                } ctx.restore();
            });
            if (half===0) ctx.rotate(Math.PI);
        }
    } ctx.restore();
};
