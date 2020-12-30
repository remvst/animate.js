'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_animation_1 = require("./base-animation");
const easing_1 = require("./easing");
const defaultApply = function (easing, duration, fromValue, toValue, elapsed) {
    return easing(elapsed / duration) * (toValue - fromValue) + fromValue;
};
class Animation extends base_animation_1.default {
    constructor(object) {
        super();
        this._propertyParent = null;
        this._actualProperty = null;
        this._object = object;
        this._duration = 1;
        this._toValue = 0;
        this._fromValue = 0;
        this._easing = easing_1.linear;
        this._progress = null;
        this._applyFunction = defaultApply;
        this._elapsed = 0;
    }
    setProperty(property) {
        this._propertyParent = this._object;
        const splitProperty = property.split('.');
        for (var i = 0; i <= splitProperty.length - 2; i++) {
            this._propertyParent = this._propertyParent[splitProperty[i]];
        }
        this._actualProperty = splitProperty[splitProperty.length - 1];
    }
    setFromToEasing(fromValue, toValue, easing = easing_1.linear) {
        this._fromValue = fromValue;
        this._toValue = toValue;
        this._easing = easing;
        return this;
    }
    currentValue() {
        return this._propertyParent[this._actualProperty];
    }
    interp(property, fromValue, toValue, easing = easing_1.linear) {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, toValue, easing);
    }
    interpFrom(property, fromValue, easing = easing_1.linear) {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, this.currentValue(), easing);
    }
    interpFromOffset(property, fromOffset, easing = easing_1.linear) {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue() + fromOffset, this.currentValue(), easing);
    }
    interpTo(property, toValue, easing = easing_1.linear) {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue(), toValue, easing);
    }
    interpToOffset(property, toOffset, easing = easing_1.linear) {
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
    cycle(elapsed) {
        if (this.finished) {
            return;
        }
        super.cycle(elapsed);
        this.applyProgress();
    }
    skip() {
        super.skip();
        this.applyProgress(); // make sure we're on the last frame
    }
    applyProgress() {
        this._propertyParent[this._actualProperty] = this._applyFunction(this._easing, this._duration, this._fromValue, this._toValue, this._elapsed);
        if (this._progress) {
            this._progress(this._elapsed / this.duration);
        }
    }
    init() {
        this._propertyParent[this._actualProperty] = this._applyFunction(this._easing, this._duration, this._fromValue, this._toValue, 0);
        return this;
    }
    set duration(duration) {
        this._duration = duration;
    }
    get duration() {
        return this._duration;
    }
}
exports.default = Animation;
