'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class BaseAnimation {
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
    run(pool) {
        this._interpolationPool = pool;
        pool.add(this);
        return this;
    }
    cycle(elapsed) {
        this._elapsed += elapsed;
        this._actualElapsed += elapsed;
        if (this._elapsed >= this.duration) {
            this._elapsed = this.duration;
        }
    }
    set duration(duration) {
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
exports.default = BaseAnimation;
