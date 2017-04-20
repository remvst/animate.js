'use strict';

const BaseAnimation = require('./base-animation');
const Action = require('./action');

class Timeline extends BaseAnimation {

    constructor() {
        super();

        this._children = [];
        this._runningChildren = [];
        this._duration = 0;
        this._breakpoints = [];
    }

    addBreakpoint() {
        this._breakpoints.push(this._duration);
        return this;
    }

    add(delay, animation) {
        if (!animation) {
            animation = delay;
            delay = this._duration;
        }

        if (animation.call) {
            animation = new Action(animation);
        }

        this._children.push({
            'delay': delay,
            'animation': animation
        });

        this._children.sort(function(a, b) {
            return a.delay - b.delay;
        });

        this._duration = Math.max(this._duration, delay + (animation._duration || 0) + (animation.delay || 0));

        return this;
    }

    wait(delay) {
        this._duration += delay;
        return this;
    }

    runAsMain(pool) {
        this.run(pool);
        pool.setMainTimeline(this);
        return this;
    }

    cycle(e) {
        super.cycle(e);

        while (this._breakpoints.length && this._breakpoints[0] <= this._elapsed) {
            this._breakpoints.shift();
        }

        let index = 0;
        this._runningChildren.slice().forEach(child => {
            child.cycle(e);

            if (child.isFinished()) {
                this._runningChildren.splice(index, 1);
            } else {
                index++;
            }
        });

        while (this._children.length > 0 && this._children[0].delay <= this._elapsed) {
            this.startChild(this._children.shift());
        }
    }

    startChild(child) {
        if (child.animation.call) {
            child.animation(this);
            return;
        }

        this._runningChildren.push(child.animation);
        child.animation.cycle(this._elapsed - child.delay);
    }

    skip() {
        const jumpTo = this._breakpoints.shift() || this._duration;
        const added = jumpTo - this._elapsed;

        // Need to warn the children that they need to go forward
        this.cycle(added);

        return this;
    }

    cancel() {
        super.cancel();

        this._runningChildren.forEach(function(child) {
            child.cancel();
        });
    }

    get duration() {
        return this._duration;
    }

    get size() {
        return this._runningChildren.length + this._children.length;
    }

}

module.exports = Timeline;
