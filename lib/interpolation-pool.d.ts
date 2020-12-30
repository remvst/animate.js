import Timeline from './timeline';
import BaseAnimation from './base-animation';
export default class InterpolationPool {
    private _interpolations;
    private _mainTimeline;
    constructor();
    cycle(elapsed: number): void;
    add(interpolation: BaseAnimation): void;
    skip(): void;
    delay(delay: number, animation: BaseAnimation): void;
    setMainTimeline(timeline: Timeline): void;
    get size(): number;
}
