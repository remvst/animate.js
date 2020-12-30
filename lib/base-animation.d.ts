import InterpolationPool from './interpolation-pool';
export default class BaseAnimation {
    protected _cancelled: boolean;
    protected _elapsed: number;
    protected _actualElapsed: number;
    protected _interpolationPool: InterpolationPool | null;
    constructor();
    get finished(): boolean;
    skip(): void;
    cancel(): void;
    run(pool: InterpolationPool): this;
    cycle(elapsed: number): void;
    set duration(duration: number);
    get duration(): number;
    get size(): number;
    get elapsed(): number;
    get interpolationPool(): InterpolationPool | null;
}
