'use strict';

const BaseAnimation = require('./base-animation');

class DelayedAction extends BaseAnimation {

    constructor(delay, callback) {
        super();
        this._callback = callback;
        this._duration = delay;
    }

    skip() {
        super.skip();
        this._callback.call(this);
    }

    cycle(e) {
        super.cycle(e);

        if (this._elapsed >= this._duration) {
            this._callback();
        }
    }

    get duration() {
        return this._duration;
    }

}

module.exports = DelayedAction;
