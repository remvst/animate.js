import BaseAnimation from './base-animation';
export default class DynamicTimeline extends BaseAnimation {
    private _built;
    private _duration;
    private _buildFunc;
    private _builtDurationFactor;
    constructor(duration: number, buildFunc: () => BaseAnimation);
    cycle(elapsed: number): void;
    skip(): void;
    set duration(duration: number);
    get duration(): number;
    get size(): number;
    get finished(): boolean;
}
