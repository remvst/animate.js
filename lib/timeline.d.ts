import BaseAnimation from './base-animation';
import InterpolationPool from './interpolation-pool';
export default class Timeline extends BaseAnimation {
    private readonly _children;
    private readonly _runningChildren;
    private _duration;
    private _breakpoints;
    constructor();
    addBreakpoint(): this;
    append(animation: BaseAnimation | (() => void)): this;
    add(delay: number, animation: BaseAnimation | (() => void)): this;
    wait(delay: number): this;
    cycle(elapsed: number): void;
    private startChild;
    skip(): this;
    cancel(): void;
    set duration(duration: number);
    get duration(): number;
    get size(): number;
    get finished(): boolean;
    runAsMain(pool: InterpolationPool): this;
}
