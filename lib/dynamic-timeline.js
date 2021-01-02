"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_animation_1 = require("./base-animation");
class DynamicTimeline extends base_animation_1.default {
    constructor(duration, buildFunc) {
        super();
        this._built = null;
        this._duration = duration;
        this._buildFunc = buildFunc;
        this._builtDurationFactor = 1;
    }
    cycle(elapsed) {
        super.cycle(elapsed);
        if (!this._built) {
            this._built = this._buildFunc();
            this._built.duration *= this._builtDurationFactor;
        }
        this._built.cycle(elapsed);
    }
    skip() {
        super.skip();
        this.cycle(0); // make sure we built
        this._built.skip();
    }
    set duration(duration) {
        const durationRatio = duration / this._duration;
        this._duration = duration;
        this._builtDurationFactor *= durationRatio;
        if (this._built) {
            this._built.duration *= durationRatio;
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
    get finished() {
        return !!(this._built && this._built.finished);
    }
}
exports.default = DynamicTimeline;
