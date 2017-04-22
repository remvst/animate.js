'use strict';

class BaseAnimation {

    constructor() {
        this._cancelled = false;
        this._elapsed = 0;
        this._actualElapsed = 0;
    }

    get finished() {
        return this._cancelled || this._elapsed >= this.duration;
    }

    skip() {
        this._elapsed = this.duration;
    }

    cancel() {
        this._cancelled = true;
    }

    run(pool) {
        pool.add(this);
        return this;
    }

    runAsMain(pool) {
        this.run(pool);
        pool.setMainTimeline(this);
        return this;
    }

    cycle(e) { // jshint ignore:line
        this._elapsed += e;
        this._actualElapsed += e;

        if (this._elapsed >= this.duration) {
            this._elapsed = this.duration;
        }
    }

    get duration() {
        return 0;
    }

    get size() {
        return 1;
    }

    get elapsed() {
        return this._elapsed;
    }

}

module.exports = BaseAnimation;
