import { BaseAnimation } from "./base-animation";
import { Easing, linear } from "./easing";

export class Animation<ObjectType extends any> extends BaseAnimation {
    private property: string | null = null;
    private propertyParent: any = null;
    private actualProperty: string | null = null;
    private _duration: number = 1;
    private toValueGetter: () => number = () => {
        throw new Error("Did not specify animation params");
    };
    private fromValueGetter: () => number = () => {
        throw new Error("Did not specify animation params");
    };
    private toValue: number | null = null;
    private fromValue: number | null = null;
    private easing: Easing = linear;
    private applyFunction:
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

        this.applyFunction = (
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

    reversed(): BaseAnimation {
        return new Animation(this.object)
            .setProperty(this.property as string & keyof ObjectType)
            .setFromToEasing(
                this.toValueGetter!,
                this.fromValueGetter!,
                (t) => 1 - this.easing(1 - t),
            )
            .during(this.duration);
    }

    private setProperty<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
    ): this {
        this.property = property;
        this.propertyParent = this.object;

        const splitProperty = property.split(".");
        for (var i = 0; i <= splitProperty.length - 2; i++) {
            this.propertyParent = this.propertyParent[splitProperty[i]];
        }

        this.actualProperty = splitProperty[splitProperty.length - 1];

        return this;
    }

    private setFromToEasing(
        fromValue: () => number,
        toValue: () => number,
        easing: Easing = linear,
    ): this {
        this.fromValueGetter = fromValue;
        this.toValueGetter = toValue;

        this.easing = easing;

        return this;
    }

    currentValue(): number {
        return this.propertyParent[this.actualProperty!];
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

    interpTo<PropertyKey extends string & keyof ObjectType>(
        property: PropertyKey,
        toValue: number,
        easing: Easing = linear,
    ): this {
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
        this.applyFunction = applyFunction;
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

    private applyProgress() {
        if (this.fromValue === null) this.fromValue = this.fromValueGetter();
        if (this.toValue === null) this.toValue = this.toValueGetter();

        this.propertyParent[this.actualProperty!] = this.applyFunction!(
            this.easing,
            this._duration,
            this.fromValue!,
            this.toValue!,
            this.elapsed,
        );
    }

    init() {
        if (this.fromValue === null) this.fromValue = this.fromValueGetter();
        if (this.toValue === null) this.toValue = this.toValueGetter();

        this.propertyParent[this.actualProperty!] = this.applyFunction!(
            this.easing,
            this._duration,
            this.fromValue!,
            this.toValue!,
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
