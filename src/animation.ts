"use strict";

import BaseAnimation from "./base-animation";
import { Easing, linear } from "./easing";

const defaultApply = function (
    easing: Easing,
    duration: number,
    fromValue: number,
    toValue: number,
    elapsed: number,
) {
    return easing(elapsed / duration) * (toValue - fromValue) + fromValue;
};

export default class Animation extends BaseAnimation {
    private readonly _object: any;
    private _propertyParent: any = null;
    private _actualProperty: string | null = null;
    private _duration: number;
    private _toValue: number;
    private _fromValue: number;
    private _easing: Easing;
    private _progress: ((t: number) => void) | null;
    private _applyFunction:
        | ((
              easing: Easing,
              duration: number,
              fromValue: number,
              toValue: number,
              elapsed: number,
          ) => any)
        | null;

    constructor(object: any) {
        super();

        this._object = object;
        this._duration = 1;
        this._toValue = 0;
        this._fromValue = 0;
        this._easing = linear;
        this._progress = null;
        this._applyFunction = defaultApply;

        this._elapsed = 0;
    }

    setProperty(property: string) {
        this._propertyParent = this._object;

        const splitProperty = property.split(".");
        for (var i = 0; i <= splitProperty.length - 2; i++) {
            this._propertyParent = this._propertyParent[splitProperty[i]];
        }

        this._actualProperty = splitProperty[splitProperty.length - 1];
    }

    setFromToEasing(
        fromValue: number,
        toValue: number,
        easing: Easing = linear,
    ) {
        this._fromValue = fromValue;
        this._toValue = toValue;

        this._easing = easing;

        return this;
    }

    currentValue(): any {
        return this._propertyParent[this._actualProperty!];
    }

    interp(
        property: string,
        fromValue: number,
        toValue: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, toValue, easing);
    }

    interpFrom(
        property: string,
        fromValue: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(fromValue, this.currentValue(), easing);
    }

    interpFromOffset(
        property: string,
        fromOffset: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            this.currentValue() + fromOffset,
            this.currentValue(),
            easing,
        );
    }

    interpTo(property: string, toValue: number, easing: Easing = linear): this {
        this.setProperty(property);
        return this.setFromToEasing(this.currentValue(), toValue, easing);
    }

    interpToOffset(
        property: string,
        toOffset: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            this.currentValue(),
            this.currentValue() + toOffset,
            easing,
        );
    }

    apply(
        applyFunction: (
            easing: Easing,
            duration: number,
            fromValue: number,
            toValue: number,
            elapsed: number,
        ) => void,
    ): this {
        this._applyFunction = applyFunction;
        return this;
    }

    during(duration: number): this {
        this._duration = duration;
        return this;
    }

    progress(callback: (t: number) => void): this {
        this._progress = callback;
        return this;
    }

    cycle(elapsed: number) {
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
        this._propertyParent[this._actualProperty!] = this._applyFunction!(
            this._easing,
            this._duration,
            this._fromValue,
            this._toValue,
            this._elapsed,
        );
        if (this._progress) {
            this._progress(this._elapsed / this.duration);
        }
    }

    init() {
        this._propertyParent[this._actualProperty!] = this._applyFunction!(
            this._easing,
            this._duration,
            this._fromValue,
            this._toValue,
            0,
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
