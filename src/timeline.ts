import { Action } from "./action";
import { BaseAnimation } from "./base-animation";

type Child = {
    delay: number;
    animation: BaseAnimation;
};

export class Timeline extends BaseAnimation {
    private readonly children: Child[] = [];
    private readonly runningChildren: BaseAnimation[] = [];
    private _duration: number = 0;
    private readonly breakpoints: number[] = [];

    reversed(): BaseAnimation {
        const res = new Timeline();
        for (const child of this.children) {
            res.add(
                this.duration - (child.delay + child.animation.duration),
                child.animation.reversed(),
            );
        }
        for (const breakpoint of this.breakpoints) {
            res.addBreakpointAt(this.duration - breakpoint);
        }
        return res;
    }

    addBreakpointAt(time: number) {
        this.breakpoints.push(time);
        this.breakpoints.sort();
        return this;
    }

    addBreakpoint() {
        return this.addBreakpointAt(this._duration);
    }

    append(animation: BaseAnimation | (() => void)): this {
        return this.add(this._duration, animation);
    }

    add(delay: number, animation: BaseAnimation | (() => void)): this {
        if (animation instanceof Timeline) {
            // Add each timeline child
            for (const child of animation.children) {
                this.add(delay + child.delay, child.animation);
            }

            // Get breakpoints from the child
            if (animation.breakpoints.length > 0) {
                for (const breakpoint of animation.breakpoints) {
                    this.breakpoints.push(breakpoint + delay);
                }

                this.breakpoints.sort();
            }

            // Calculate the new duration
            this._duration = Math.max(
                this._duration,
                delay + animation.duration,
            );

            return this;
        }

        if (!(animation instanceof BaseAnimation)) {
            animation = new Action(animation);
        }

        // Find the index at which we want to insert
        let index = this.children.length - 1;
        while (index >= 0 && this.children[index].delay > delay) {
            index--;
        }

        // Insert
        this.children.splice(index + 1, 0, {
            delay: delay,
            animation: animation,
        });

        // Calculate the new duration
        this._duration = Math.max(this._duration, delay + animation.duration);

        return this;
    }

    wait(delay: number): this {
        this._duration += delay;
        return this;
    }

    cycle(elapsed: number) {
        super.cycle(elapsed);

        while (this.breakpoints.length && this.breakpoints[0] <= this.elapsed) {
            this.breakpoints.shift();
        }

        let index = 0;
        this.runningChildren.slice().forEach((child) => {
            child.cycle(elapsed);

            if (child.finished) {
                this.runningChildren.splice(index, 1);
            } else {
                index++;
            }
        });

        while (
            this.children.length > 0 &&
            this.children[0].delay <= this.elapsed
        ) {
            this.startChild(this.children.shift()!);
        }
    }

    private startChild(child: Child) {
        child.animation.cycle(this.actualElapsed - child.delay);

        if (!child.animation.finished) {
            this.runningChildren.push(child.animation);
        }
    }

    skip() {
        const jumpTo = this.breakpoints.shift() || this._duration;
        const added = jumpTo - this.elapsed;

        // Need to warn the children that they need to go forward
        this.cycle(added);

        return this;
    }

    cancel() {
        super.cancel();

        for (const child of this.children) {
            child.animation.cancel();
        }

        for (const child of this.runningChildren) {
            child.cancel();
        }

        this.children.splice(0, this.children.length);
        this.runningChildren.splice(0, this.runningChildren.length);
    }

    set duration(duration) {
        const durationRatio = duration / this._duration;

        this._duration = duration;

        for (const child of this.children) {
            child.delay *= durationRatio;
            child.animation.duration *= durationRatio;
        }

        for (const child of this.runningChildren) {
            child.duration *= durationRatio;
        }
    }

    get duration() {
        return this._duration;
    }

    get size() {
        return (
            this.runningChildren.reduce((size, child) => {
                return size + child.size;
            }, 0) +
            this.children.reduce((size, child) => {
                return size + child.animation.size;
            }, 0)
        );
    }

    get finished() {
        return (
            super.finished &&
            this.children.length === 0 &&
            this.runningChildren.length === 0
        );
    }
}
