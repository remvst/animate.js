"use strict";

const Timeline = require('./timeline');

class DynamicTimeline extends Timeline {

    constructor(duration, buildFunc) {
        super();
        this._built = false;
        this._duration = duration;
        this._buildFunc = buildFunc;
    }

    cycle(e) {
        if (!this._built) {
            this._built = true;
            this.add(0, this._buildFunc(this));
        }
        super.cycle(e);
    }

}

module.exports = DynamicTimeline;
