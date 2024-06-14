import { BaseAnimation } from "./base-animation";

export class Action extends BaseAnimation {
    private called: boolean = false;

    constructor(private readonly callback: () => void) {
        super();
    }

    cycle(elapsed: number) {
        super.cycle(elapsed);
        this.called = true;
        this.callback();
    }

    get finished() {
        return super.finished || this.called;
    }

    get duration(): number {
        return 0;
    }

    set duration(duration: number) {
        // no-op
    }

    reversed(): BaseAnimation {
        return new Action(this.callback);
    }
}
