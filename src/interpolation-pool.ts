import { BaseAnimation } from "./base-animation";
import { Timeline } from "./timeline";

export class InterpolationPool {
    private _interpolations: BaseAnimation[] = [];
    private _mainTimeline: BaseAnimation | null = null;

    cycle(elapsed: number) {
        // Loop is kinda weird because we want the _interpolations to be performed
        // in the same order they were added
        let i = 0;
        while (this._interpolations[i]) {
            const interpolation = this._interpolations[i];
            if (!interpolation.finished) {
                interpolation.cycle(elapsed);
            }
            if (!interpolation.finished) {
                i++;
            } else {
                this._interpolations.splice(i, 1);

                if (interpolation === this._mainTimeline) {
                    this._mainTimeline = null;
                }
            }
        }
    }

    add(interpolation: BaseAnimation) {
        this._interpolations.push(interpolation);
    }

    skip() {
        if (!this._mainTimeline) {
            return;
        }

        this._mainTimeline.skip();
    }

    delay(delay: number, animation: BaseAnimation | (() => void)) {
        new Timeline().add(delay, animation).run(this);
    }

    setMainTimeline(timeline: BaseAnimation) {
        this._mainTimeline = timeline;
    }

    clear() {
        this._interpolations = [];
        this._mainTimeline = null;
    }

    get size() {
        return this._interpolations.reduce((count, interpolation) => {
            return count + interpolation.size;
        }, 0);
    }
}
