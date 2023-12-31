import BaseAnimation from "./base-animation";
import { Easing, linear } from "./easing";

export default class Animation<ObjectType extends any> extends BaseAnimation {
    private readonly _object: any;
    private _propertyParent: any = null;
    private _actualProperty: string | null = null;
    private _duration: number;
    private _toValueGetter: () => number | null = () => null;
    private _fromValueGetter: () => number | null = () => null;
    private _toValue: number | null = null;
    private _fromValue: number | null = null;
    private _easing: Easing;
    private _progress: ((t: number) => void) | null;
    private _applyFunction:
        | ((
              easing: Easing,
              duration: number,
              fromValue: number,
              toValue: number,
              elapsed: number,
          ) => number)
        | null;

    constructor(object: ObjectType) {
        super();

        this._object = object;
        this._duration = 1;
        this._toValue = null;
        this._fromValue = null;
        this._easing = linear;
        this._progress = null;
        this._applyFunction = (
            easing: Easing,
            duration: number,
            fromValue: number,
            toValue: number,
            elapsed: number,
        ) => {
            return (
                easing(elapsed / duration) * (toValue - fromValue) + fromValue
            );
        };

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
        fromValue: () => number,
        toValue: () => number,
        easing: Easing = linear,
    ) {
        this._fromValueGetter = fromValue;
        this._toValueGetter = toValue;

        this._easing = easing;

        return this;
    }

    currentValue(): number {
        return this._propertyParent[this._actualProperty!];
    }

    interp<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
        fromValue: number,
        toValue: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => fromValue,
            () => toValue,
            easing,
        );
    }

    interpFrom(
        property: string,
        fromValue: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => fromValue,
            () => this.currentValue(),
            easing,
        );
    }

    interpFromOffset(
        property: string,
        fromOffset: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => this.currentValue() + fromOffset,
            () => this.currentValue(),
            easing,
        );
    }

    interpTo(property: string, toValue: number, easing: Easing = linear): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => this.currentValue(),
            () => toValue,
            easing,
        );
    }

    interpToOffset(
        property: string,
        toOffset: number,
        easing: Easing = linear,
    ): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => this.currentValue(),
            () => this.currentValue() + toOffset,
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
        ) => number,
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
        if (this._fromValue === null) this._fromValue = this._fromValueGetter();
        if (this._toValue === null) this._toValue = this._toValueGetter();

        this._propertyParent[this._actualProperty!] = this._applyFunction!(
            this._easing,
            this._duration,
            this._fromValue!,
            this._toValue!,
            this._elapsed,
        );
        if (this._progress) {
            this._progress(this._elapsed / this.duration);
        }
    }

    init() {
        if (this._fromValue === null) this._fromValue = this._fromValueGetter();
        if (this._toValue === null) this._toValue = this._toValueGetter();

        this._propertyParent[this._actualProperty!] = this._applyFunction!(
            this._easing,
            this._duration,
            this._fromValue!,
            this._toValue!,
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
