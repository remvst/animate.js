"use strict";

import { Animation, DynamicTimeline, Timeline } from "../src/index";

describe("a dynamic timeline", () => {
    it("can be instantiated", () => {
        const build = jasmine.createSpy();
        const dtl = new DynamicTimeline(123, build);

        expect(dtl.size).toBe(1);
        expect(dtl.duration).toBe(123);
        expect(dtl.finished).toBe(false);
        expect(build).not.toHaveBeenCalled();
    });

    it("can be built on its first cycle", () => {
        const dtl = new DynamicTimeline(123, () => {
            return new Timeline()
                .append(new Animation({}).interp("foo", 0, 1).during(1))
                .append(new Animation({}).interp("foo", 0, 1).during(1));
        });

        dtl.cycle(0);

        expect(dtl.size).toBe(2);
        expect(dtl.duration).toBe(123);
        expect(dtl.finished).toBe(false);
    });

    it("can be built and run", () => {
        const object = {};

        const dtl = new DynamicTimeline(123, () => {
            return new Timeline()
                .append(new Animation(object).interp("foo", 0, 1).during(1))
                .append(new Animation(object).interp("foo", 0, 1).during(1));
        });

        dtl.cycle(0.5);

        expect(dtl.size).toBe(2);
        expect(dtl.finished).toBe(false);
        expect((object as any).foo).toBe(0.5);
    });

    it("only builds once", () => {
        const build = jasmine
            .createSpy()
            .and.returnValue(new Timeline().wait(1));
        const dtl = new DynamicTimeline(123, build);

        dtl.cycle(0);
        dtl.cycle(0);

        expect(dtl.size).toBe(0);
        expect(dtl.duration).toBe(123);
        expect(dtl.finished).toBe(false);
        expect(build.calls.count()).toBe(1);
    });

    it("isn't finished if it hasn't been built yet", () => {
        const dtl = new DynamicTimeline(123, () => {
            throw new Error();
        });

        expect(dtl.finished).toBe(false);
    });

    it("isn't finished if its child isn't finished", () => {
        const dtl = new DynamicTimeline(1, () => {
            return new Timeline().wait(100);
        });

        dtl.cycle(10);

        expect(dtl.finished).toBe(false);
    });

    it("can be skipped", () => {
        const child = new Timeline().wait(5);
        spyOn(child, "skip").and.callThrough();

        const dtl = new DynamicTimeline(10, () => child);

        dtl.skip();

        expect(dtl.finished).toBe(true);
        expect(child.finished).toBe(true);
        expect(child.skip).toHaveBeenCalled();
    });

    it("can be set a new duration while not started", () => {
        const child = new Timeline().wait(5);
        const dtl = new DynamicTimeline(10, () => child);

        dtl.duration = 5;

        expect(dtl.duration).toBe(5);
        expect(child.duration).toBe(5);
    });

    it("will set the child duration when building", () => {
        const child = new Timeline().wait(5);
        const dtl = new DynamicTimeline(10, () => child);

        dtl.duration = 5;
        dtl.duration = 1;

        dtl.cycle(0);

        expect(dtl.duration).toBe(1);
        expect(child.duration).toBe(0.5);
    });

    it("can be set a new duration while running", () => {
        const child = new Timeline().wait(5);
        const dtl = new DynamicTimeline(10, () => child);

        dtl.cycle(2);

        dtl.duration = 5;

        expect(dtl.duration).toBe(5);
        expect(child.duration).toBe(2.5);
    });
});
