import { BaseAnimation } from "./base-animation";

export class Action extends BaseAnimation {
    private _callback: () => void;
    private _called: boolean;

    constructor(callback: () => void) {
        super();
        this._callback = callback;
        this._called = false;
    }

    cycle(elapsed: number) {
        super.cycle(elapsed);
        this._called = true;
        this._callback();
    }

    get finished() {
        return super.finished || this._called;
    }
}
