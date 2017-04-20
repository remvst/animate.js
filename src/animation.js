'use strict';

const BaseAnimation = require('./base-animation');

const defaultApply = function(easing, duration, fromValue, toValue, elapsed) {
    return easing(elapsed, fromValue, toValue - fromValue, duration);
};

class Animation extends BaseAnimation {

    constructor(object) {
        super();

        this._object = object;
        this._delay = 0;
        this._duration = 1;
        this._toValue = 0;
        this._fromValue = 0;
        this._easing = null;
        this._onFinish = null;
        this._onProgress = null;
        this._applyFunction = defaultApply;
        this._overrides = true;

        this._elapsed = 0;
    }

    interp(property, fromValue, toValue, easing) {
        this._property = property;
        this._propertyParent = this._object;

        const splitProperty = property.split('.');
        for (var i = 0 ; i <= splitProperty.length - 2 ; i++) {
            this._propertyParent = this._propertyParent[splitProperty[i]];
        }

        this._actualProperty = splitProperty[splitProperty.length - 1];

        this._fromValue = fromValue;
        this._toValue = toValue;

        this._easing = easing || Math.linearTween;

        return this;
    }

    apply(applyFunction) {
        this._applyFunction = applyFunction;
        return this;
    }

    during(duration) {
        this._duration = duration;
        return this;
    }

    progress(callback) {
        this._onProgress = callback;
        return this;
    }

    cycle(e) {
        super.cycle(e);

        if (this.isFinished()) {
            return;
        }

        this.applyProgress();
    }

    skip() {
        super.skip();
        this.applyProgress(); // make sure we're on the last frame
    }

    applyProgress() {
        this._propertyParent[this._actualProperty] = this._applyFunction(
            this._easing,
            this._duration,
            this._fromValue,
            this._toValue,
            this._elapsed
        );
        if (this._onProgress) {
            this._onProgress(this._elapsed / this.duration);
        }
    }

    init() {
        this._propertyParent[this._actualProperty] = this._applyFunction(
            this._easing,
            this._duration,
            this._fromValue,
            this._toValue,
            0
        );
        return this;
    }

    get duration() {
        return this._duration;
    }
}

module.exports = Animation;
