'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_animation_1 = require("./base-animation");
class Loop extends base_animation_1.default {
    constructor(interval, callback, initialDelay) {
        super();
        if (interval <= 0) {
            throw new Error('Cannot create a loop with an interval of zero or less');
        }
        this._interval = interval;
        this._nextCall = initialDelay !== undefined ? initialDelay : this._interval;
        this._callback = callback;
        this._cancelled = false;
    }
    cycle(elapsed) {
        this._nextCall -= elapsed;
        while (this._nextCall <= 0) {
            this._nextCall += this._interval;
            this._callback();
        }
    }
    set duration(duration) {
        throw new Error('Cannot set duration of a loop');
    }
    get duration() {
        return Infinity;
    }
}
exports.default = Loop;
