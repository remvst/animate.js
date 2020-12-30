'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const timeline_1 = require("./timeline");
class InterpolationPool {
    constructor() {
        this._interpolations = [];
        this._mainTimeline = null;
    }
    cycle(elapsed) {
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
            }
            else {
                this._interpolations.splice(i, 1);
                if (interpolation === this._mainTimeline) {
                    this._mainTimeline = null;
                }
            }
        }
    }
    add(interpolation) {
        this._interpolations.push(interpolation);
    }
    skip() {
        if (!this._mainTimeline) {
            return;
        }
        this._mainTimeline.skip();
    }
    delay(delay, animation) {
        new timeline_1.default().add(delay, animation).run(this);
    }
    setMainTimeline(timeline) {
        this._mainTimeline = timeline;
    }
    get size() {
        return this._interpolations.reduce((count, interpolation) => {
            return count + interpolation.size;
        }, 0);
    }
}
exports.default = InterpolationPool;
