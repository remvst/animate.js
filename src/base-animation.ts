import { InterpolationPool } from "./interpolation-pool";

export type OnCycleCallback = (elapsed: number) => void;

export abstract class BaseAnimation {
    protected cancelled: boolean = false;
    elapsed: number = 0;
    protected actualElapsed: number = 0;
    protected _onCycle: OnCycleCallback = () => {};

    get finished() {
        return this.cancelled || this.elapsed >= this.duration;
    }

    skip() {
        this.elapsed = this.duration;
    }

    cancel() {
        this.cancelled = true;
    }

    onCycle(func: OnCycleCallback): this {
        this._onCycle = func;
        return this;
    }

    onProgress(func: OnCycleCallback): this {
        return this.onCycle(() => func(this.elapsed / this.duration));
    }

    run(pool: InterpolationPool): this {
        pool.add(this);
        return this;
    }

    runAsMain(pool: InterpolationPool) {
        this.run(pool);
        pool.setMainTimeline(this);
        return this;
    }

    cycle(elapsed: number) {
        // jshint ignore:line
        this.elapsed += elapsed;
        this.actualElapsed += elapsed;

        if (this.elapsed >= this.duration) {
            this.elapsed = this.duration;
        }

        this._onCycle(elapsed);
    }

    abstract get duration(): number;
    abstract set duration(duration: number);

    get size(): number {
        return 1;
    }

    abstract reversed(): BaseAnimation;
}
