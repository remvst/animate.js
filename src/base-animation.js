'use strict';

class BaseAnimation {

    constructor() {
        this._cancelled = false;
        this._pool = null;
        this._elapsed = 0;
    }

    isFinished() {
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
        this._pool = pool;
        return this;
    }

    cycle(e) { // jshint ignore:line
        this._elapsed += e;

        if (this._elapsed >= this.duration) {
            this._elapsed = this.duration;
        }
    }

    get duration() {
        return 0;
    }

    get pool() {
        return this._pool;
    }

    get size() {
        return 1;
    }

}

module.exports = BaseAnimation;
