import BaseAnimation from "./base-animation";

export default class Loop extends BaseAnimation {
    private _interval: number;
    private _nextCall: number;
    private _callback: () => void;

    constructor(
        interval: number,
        callback: () => void,
        initialDelay: number | undefined = undefined,
    ) {
        super();

        if (interval <= 0) {
            throw new Error(
                "Cannot create a loop with an interval of zero or less",
            );
        }

        this._interval = interval;
        this._nextCall =
            initialDelay !== undefined ? initialDelay : this._interval;
        this._callback = callback;
        this._cancelled = false;
    }

    cycle(elapsed: number) {
        this._nextCall -= elapsed;
        while (this._nextCall <= 0) {
            this._nextCall += this._interval;
            this._callback();
        }
    }

    set duration(duration: number) {
        // jshint ignore:line
        throw new Error("Cannot set duration of a loop");
    }

    get duration() {
        return Infinity;
    }
}
