'use strict';

const BaseAnimation = require('./base-animation');
const Easing = require('./easing');

const defaultApply = function(easing, duration, fromValue, toValue, elapsed) {
    return easing(elapsed / duration) * (toValue - fromValue) + fromValue;
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
        this._progress = null;
        this._applyFunction = defaultApply;
        this._overrides = true;

        this._elapsed = 0;
    }

    setProperty(property) {
        this._property = property;
        this._propertyParent = this._object;

        const splitProperty = property.split('.');
        for (var i = 0 ; i <= splitProperty.length - 2 ; i++) {
            this._propertyParent = this._propertyParent[splitProperty[i]];
        }

        this._actualProperty = splitProperty[splitProperty.length - 1];
    }

    setFromToEasing(fromValue, toValue, easing) {
        this._fromValue = fromValue;
        this._toValue = toValue;

        this._easing = easing || Easing.linear;

        return this;
    }

    currentValue() {
        return this._propertyParent[this._actualProperty];
    }

    interp(property, fromValue, toValue, easing) {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, toValue, easing);
    }

    interpFrom(property, fromValue, easing) {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, this.currentValue(), easing);
    }

    interpFromOffset(property, fromOffset, easing) {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue() + fromOffset, this.currentValue(), easing);
    }

    interpTo(property, toValue, easing) {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue(), toValue, easing);
    }

    interpToOffset(property, toOffset, easing) {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue(), this.currentValue() + toOffset, easing);
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
        this._progress = callback;
        return this;
    }

    cycle(e) {
        if (this.finished) {
            return;
        }

        super.cycle(e);
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
        if (this._progress) {
            this._progress(this._elapsed / this.duration);
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

    set duration(duration) {
        this._duration = duration;
    }

    get duration() {
        return this._duration;
    }
}

module.exports = Animation;
