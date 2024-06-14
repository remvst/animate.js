import { BaseAnimation } from "./base-animation";
import { Easing, linear } from "./easing";

export class Animation<ObjectType extends any> extends BaseAnimation {
    private _propertyParent: any = null;
    private _actualProperty: string | null = null;
    private _duration: number = 1;
    private _toValueGetter: () => number | null = () => null;
    private _fromValueGetter: () => number | null = () => null;
    private _toValue: number | null = null;
    private _fromValue: number | null = null;
    private _easing: Easing = linear;
    private _applyFunction:
        | ((
              easing: Easing,
              duration: number,
              fromValue: number,
              toValue: number,
              elapsed: number,
          ) => number)
        | null;

    constructor(private readonly object: ObjectType) {
        super();

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
    }

    setProperty<PropertyKey extends string & keyof ObjectType>(property: PropertyKey) {
        this._propertyParent = this.object;

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

    interpFrom<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
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

    interpFromOffset<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
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

    interpTo<PropertyKey extends string & keyof ObjectType>(property: PropertyKey, toValue: number, easing: Easing = linear): this {
        this.setProperty(property);
        return this.setFromToEasing(
            () => this.currentValue(),
            () => toValue,
            easing,
        );
    }

    interpToOffset<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
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

    progress(callback: (progress: number) => void): this {
        return this.onProgress(callback);
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
