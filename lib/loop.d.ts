import BaseAnimation from './base-animation';
export default class Loop extends BaseAnimation {
    private _interval;
    private _nextCall;
    private _callback;
    constructor(interval: number, callback: () => void, initialDelay: number);
    cycle(elapsed: number): void;
    set duration(duration: number);
    get duration(): number;
}
