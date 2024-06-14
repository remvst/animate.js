import { BaseAnimation } from "./base-animation";

export class DynamicTimeline extends BaseAnimation {
    private built: BaseAnimation | null = null;

    constructor(
        public duration: number,
        private readonly buildFunc: () => BaseAnimation,
    ) {
        super();
    }

    reversed(): BaseAnimation {
        return new DynamicTimeline(this.duration, () =>
            this.buildFunc().reversed(),
        );
    }

    cycle(elapsed: number) {
        super.cycle(elapsed);

        if (!this.built) {
            this.built = this.buildFunc();
            this.built.duration = this.duration;
        }

        this.built.cycle(elapsed);
    }

    skip() {
        super.skip();
        this.cycle(0); // make sure we built
        this.built!.skip();
    }

    get size() {
        if (this.built) {
            return this.built.size;
        }

        return 1;
    }

    get finished() {
        return !!(this.built && this.built.finished);
    }
}
