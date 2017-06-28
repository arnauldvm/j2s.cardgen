'use strict';

// class SavedContext

// constructor
const SavedContext = function (/* CanvasRenderingContext2D */ ctx) {
    for (let attrname in ctx) {
        if (attrname === 'canvas') continue;
        if (typeof ctx[attrname] === 'function') continue;
        if (typeof ctx[attrname] === 'undefined') continue;
        console.log(attrname, ctx[attrname]);
        this[attrname] = ctx[attrname];
    }
}

SavedContext.prototype.restoreIn = function(/* CanvasRenderingContext2D */ ctx) {
    for (let attrname in ctx) {
        if (attrname === 'canvas') continue;
        if (typeof ctx[attrname] === 'function') continue;
        ctx[attrname] = this[attrname];
    }
}

module.exports.SavedContext = SavedContext;
