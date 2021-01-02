'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.easeInOutQuint = exports.easeOutQuint = exports.easeInQuint = exports.easeInOutQuart = exports.easeOutQuart = exports.easeInQuart = exports.easeInOutCubic = exports.easeOutCubic = exports.easeInCubic = exports.easeInOutQuad = exports.easeOutQuad = exports.easeInQuad = exports.linear = void 0;
// no easing, no acceleration
function linear(t) { return t; }
exports.linear = linear;
;
// accelerating from zero velocity
function easeInQuad(t) { return t * t; }
exports.easeInQuad = easeInQuad;
;
// decelerating to zero velocity
function easeOutQuad(t) { return t * (2 - t); }
exports.easeOutQuad = easeOutQuad;
;
// acceleration until halfway, then deceleration
function easeInOutQuad(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
exports.easeInOutQuad = easeInOutQuad;
;
// accelerating from zero velocity
function easeInCubic(t) { return t * t * t; }
exports.easeInCubic = easeInCubic;
;
// decelerating to zero velocity
function easeOutCubic(t) { return (--t) * t * t + 1; }
exports.easeOutCubic = easeOutCubic;
;
// acceleration until halfway, then deceleration
function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }
exports.easeInOutCubic = easeInOutCubic;
;
// accelerating from zero velocity
function easeInQuart(t) { return t * t * t * t; }
exports.easeInQuart = easeInQuart;
;
// decelerating to zero velocity
function easeOutQuart(t) { return 1 - (--t) * t * t * t; }
exports.easeOutQuart = easeOutQuart;
;
// acceleration until halfway, then deceleration
function easeInOutQuart(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; }
exports.easeInOutQuart = easeInOutQuart;
;
// accelerating from zero velocity
function easeInQuint(t) { return t * t * t * t * t; }
exports.easeInQuint = easeInQuint;
;
// decelerating to zero velocity
function easeOutQuint(t) { return 1 + (--t) * t * t * t * t; }
exports.easeOutQuint = easeOutQuint;
;
// acceleration until halfway, then deceleration
function easeInOutQuint(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
exports.easeInOutQuint = easeInOutQuint;
;
