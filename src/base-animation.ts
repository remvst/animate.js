import { InterpolationPool } from "./interpolation-pool";

export type OnCycleCallback = (elapsed: number) => void;

export abstract class BaseAnimation {
    protected _cancelled: boolean = false;
    protected _elapsed: number = 0;
    protected _actualElapsed: number = 0;
    protected _onCycle: OnCycleCallback = () => {};

    get finished() {
        return this._cancelled || this._elapsed >= this.duration;
    }

    skip() {
        this._elapsed = this.duration;
    }

    cancel() {
        this._cancelled = true;
    }

    onCycle(func: OnCycleCallback): this {
        this._onCycle = func;
        return this;
    }

    onProgress(func: OnCycleCallback): this {
        return this.onCycle(() => func(this._elapsed / this.duration));
    }

    run(pool: InterpolationPool): this {
        pool.add(this);
        return this;
    }

    cycle(elapsed: number) {
        // jshint ignore:line
        this._elapsed += elapsed;
        this._actualElapsed += elapsed;

        if (this._elapsed >= this.duration) {
            this._elapsed = this.duration;
        }

        this._onCycle(elapsed);
    }

    set duration(duration: number) {
        // jshint ignore:line
        // no-op
    }

    get duration(): number {
        return 0;
    }

    get size(): number {
        return 1;
    }

    get elapsed(): number {
        return this._elapsed;
    }
}
