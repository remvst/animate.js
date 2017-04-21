"use strict";

const BaseAnimation = require('./base-animation');

class DynamicTimeline extends BaseAnimation {

    constructor(duration, buildFunc) {
        super();
        this._built = null;
        this._duration = duration;
        this._buildFunc = buildFunc;
    }

    cycle(e) {
        if (!this._built) {
            this._built = this._buildFunc(this);
        }

        if (!this._built.isFinished()) {
            this._built.cycle(e);
        }
    }

    get duration() {
        return this._duration;
    }

    get size() {
        if (this._built) {
            return this._built.size;
        }

        return 1;
    }

}

module.exports = DynamicTimeline;
