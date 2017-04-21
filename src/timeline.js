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

        if (animation instanceof Timeline) {
            // Add each timeline child
            animation._children.forEach(child => {
                this.add(delay + child.delay, child.animation);
            });

            // Get breakpoints from the child
            if (animation._breakpoints.length > 0) {
                animation._breakpoints.forEach(breakpoint => {
                    this._breakpoints.push(breakpoint + delay);
                });

                this._breakpoints.sort();
            }

            return this;
        }

        if (animation.call) {
            animation = new Action(animation);
        }

        // Find the index at which we want to insert
        let index = this._children.length - 1;
        while (index >= 0 && this._children[index].delay > delay) {
            index--;
        }

        // Insert
        this._children.splice(index + 1, 0, {
            'delay': delay,
            'animation': animation
        });

        // Calculate the new duration. The last child alone is not enough, as it could be shorter than another child
        // that starts earlier (children are sorted based on their start, not their end time)
        const lastChild = this._children[this._children.length - 1];
        this._duration = Math.max(this._duration, lastChild.delay + lastChild.animation.duration);

        return this;
    }

    wait(delay) {
        this._duration += delay;
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
        child.animation.cycle(this._elapsed - child.delay);

        if (!child.animation.isFinished()) {
            this._runningChildren.push(child.animation);
        }
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

        this._children.forEach(function(child) {
            child.animation.cancel();
        });

        this._runningChildren.forEach(function(child) {
            child.cancel();
        });
    }

    get duration() {
        return this._duration;
    }

    get size() {
        return this._runningChildren.reduce((size, child) => {
            return size + child.size;
        }, 0) + this._children.reduce((size, child) => {
            return size + child.animation.size;
        }, 0);
    }

}

module.exports = Timeline;
