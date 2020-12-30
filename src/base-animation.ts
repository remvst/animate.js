'use strict';

import InterpolationPool from './interpolation-pool';

export default class BaseAnimation {

    protected _cancelled: boolean;
    protected _elapsed: number;
    protected _actualElapsed: number;
    protected _interpolationPool: InterpolationPool | null;

    constructor() {
        this._cancelled = false;
        this._elapsed = 0;
        this._actualElapsed = 0;
        this._interpolationPool = null;
    }

    get finished() {
        return this._cancelled || this._elapsed >= this.duration;
    }

    skip() {
        this._elapsed = this.duration;
    }

    cancel() {
        this._cancelled = true;
        this._interpolationPool = null;
    }

    run(pool: InterpolationPool) {
        this._interpolationPool = pool;
        pool.add(this);
        return this;
    }

    cycle(elapsed: number) { // jshint ignore:line
        this._elapsed += elapsed;
        this._actualElapsed += elapsed;

        if (this._elapsed >= this.duration) {
            this._elapsed = this.duration;
        }
    }

    set duration(duration: number) { // jshint ignore:line
        // no-op
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

    get interpolationPool() {
        return this._interpolationPool;
    }

}
