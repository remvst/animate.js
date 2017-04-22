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
        super.cycle(e);

        if (!this._built) {
            this._built = this._buildFunc(this);
        }

        this._built.cycle(e);
    }

    skip() {
        super.skip();
        this.cycle(0); // make sure we built
        this._built.skip();
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

    get finished() {
        return !!(this._built && this._built.finished);
    }

}

module.exports = DynamicTimeline;
