'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_animation_1 = require("./base-animation");
const action_1 = require("./action");
class Timeline extends base_animation_1.default {
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
    append(animation) {
        return this.add(this._duration, animation);
    }
    add(delay, animation) {
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
        if (!(animation instanceof base_animation_1.default)) {
            animation = new action_1.default(animation);
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
        // Calculate the new duration
        this._duration = Math.max(this._duration, delay + animation.duration);
        return this;
    }
    wait(delay) {
        this._duration += delay;
        return this;
    }
    cycle(elapsed) {
        super.cycle(elapsed);
        while (this._breakpoints.length && this._breakpoints[0] <= this._elapsed) {
            this._breakpoints.shift();
        }
        let index = 0;
        this._runningChildren.slice().forEach(child => {
            child.cycle(elapsed);
            if (child.finished) {
                this._runningChildren.splice(index, 1);
            }
            else {
                index++;
            }
        });
        while (this._children.length > 0 && this._children[0].delay <= this._elapsed) {
            this.startChild(this._children.shift());
        }
    }
    startChild(child) {
        child.animation.cycle(this._actualElapsed - child.delay);
        if (!child.animation.finished) {
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
        this._children.forEach(child => {
            child.animation.cancel();
        });
        this._runningChildren.forEach(child => {
            child.cancel();
        });
        this._children.splice(0, this._children.length);
        this._runningChildren.splice(0, this._runningChildren.length);
    }
    set duration(duration) {
        const durationRatio = duration / this._duration;
        this._duration = duration;
        this._children.forEach(child => {
            child.delay *= durationRatio;
            child.animation.duration *= durationRatio;
        });
        this._runningChildren.forEach(child => {
            child.duration *= durationRatio;
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
    get finished() {
        return super.finished && this._children.length === 0 && this._runningChildren.length === 0;
    }
    runAsMain(pool) {
        this.run(pool);
        pool.setMainTimeline(this);
        return this;
    }
}
exports.default = Timeline;
