'use strict';

const BaseAnimation = require('./base-animation');

class Loop extends BaseAnimation {

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

    cycle(e) {
        this._nextCall -= e;
        while (this._nextCall <= 0) {
            this._nextCall += this._interval;
            this._callback();
        }
    }

    get duration() {
        return Infinity;
    }

}

module.exports = Loop;
