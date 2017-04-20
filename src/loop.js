'use strict';

const BaseAnimation = require('./base-animation');

class Loop extends BaseAnimation {

    constructor(interval, callback, initialDelay) {
        super();

        this.interval = interval;
        this.nextCall = initialDelay !== undefined ? initialDelay : this.interval;
        this.callback = callback;
        this.cancelled = false;
    }

    cycle(e) {
        this.nextCall -= e;
        if (this.nextCall <= 0) {
            this.nextCall = this.interval;
            this.callback();
        }
    }

    get duration() {
        return Number.MAX_VALUE;
    }

}

module.exports = Loop;
