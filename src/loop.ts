import { BaseAnimation } from "./base-animation";

export class Loop extends BaseAnimation {
    private nextCall: number;
    private readonly initialDelay: number;

    constructor(
        private readonly interval: number,
        private readonly callback: () => void,
        initialDelay?: number,
    ) {
        super();

        if (interval <= 0) {
            throw new Error(
                "Cannot create a loop with an interval of zero or less",
            );
        }

        this.initialDelay =
            initialDelay !== undefined ? initialDelay : this.interval;
        this.nextCall = this.initialDelay;
        this.cancelled = false;
    }

    reversed(): BaseAnimation {
        return new Loop(
            this.interval,
            this.callback,
            this.interval - this.initialDelay,
        );
    }

    cycle(elapsed: number) {
        this.nextCall -= elapsed;
        while (this.nextCall <= 0) {
            this.nextCall += this.interval;
            this.callback();
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
