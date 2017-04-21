'use strict';

const Timeline = require('./timeline');

class InterpolationPool {

    constructor() {
        this._interpolations = [];
        this._mainTimeline = null;
    }

    cycle(e) {
        // Loop is kinda weird because we want the _interpolations to be performed
        // in the same order they were added
        let i = 0;
        while (this._interpolations[i]) {
            const interpolation = this._interpolations[i];
            interpolation.cycle(e);
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

    add(interpolation) {
        this._interpolations.push(interpolation);
    }

    skip() {
        if (!this._mainTimeline) {
            return;
        }

        this._mainTimeline.skip();
    }

    delay(delay, action) {
        new Timeline().add(delay, action).run(this);
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

module.exports = InterpolationPool;
