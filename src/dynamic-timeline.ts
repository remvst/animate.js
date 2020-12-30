"use strict";

import BaseAnimation from './base-animation';

export default class DynamicTimeline extends BaseAnimation {

    private _built: BaseAnimation | null;
    private _duration: number;
    private _buildFunc: () => BaseAnimation;
    private _builtDurationFactor: number;

    constructor(duration: number, buildFunc: () => BaseAnimation) {
        super();
        this._built = null;
        this._duration = duration;
        this._buildFunc = buildFunc;
        this._builtDurationFactor = 1;
    }

    cycle(elapsed: number) {
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
        this._built!.skip();
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
