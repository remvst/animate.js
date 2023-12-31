import { Easing } from "../src/easing";
import { Animation } from "../src/index";

describe("an animation", () => {
    let object: any;

    beforeEach(function () {
        object = {
            foo: 43,
            bar: {
                baz: 1,
            },
        };
    });

    it("can be instantiated and have a default duration", () => {
        const animation = new Animation(object).interp("foo", 0, 1);

        expect(animation.duration).toBe(1);
        expect(object.foo).toBe(43);
        expect(animation.elapsed).toBe(0);
    });

    it("can be cancelled", () => {
        const animation = new Animation(object).interp("foo", 0, 1);

        animation.cancel();

        expect(animation.finished).toBe(true);
    });

    it("can be cancelled after running", () => {
        const animation = new Animation(object).interp("foo", 0, 1).during(1);

        animation.cycle(0.5);
        animation.cancel();

        expect(animation.finished).toBe(true);
        expect(object.foo).toBe(0.5);
    });

    it("can be instantiated and have a specific duration", () => {
        const animation = new Animation(object).interp("foo", 0, 1).during(123);

        expect(animation.duration).toBe(123);
        expect(object.foo).toBe(43);
    });

    it("can be instantiated and initialize the object", () => {
        new Animation(object).interp("foo", 123456, 1).init();

        expect(object.foo).toBe(123456);
    });

    it("can cycle with a zero delta", () => {
        const animation = new Animation(object)
            .interp("foo", 123456, 1)
            .during(10);

        animation.cycle(0);

        expect(object.foo).toBe(123456);
        expect(animation.elapsed).toBe(0);
    });

    it("can cycle with a small delta", () => {
        const animation = new Animation(object).interp("foo", 0, 1).during(10);

        animation.cycle(5);

        expect(object.foo).toBe(0.5);
        expect(animation.elapsed).toBe(5);
    });

    it("can cycle with a large delta", () => {
        const animation = new Animation(object).interp("foo", 0, 1).during(10);

        animation.cycle(50);

        expect(object.foo).toBe(1);
        expect(animation.elapsed).toBe(10);
    });

    it("does not do anything once it's over", () => {
        const animation = new Animation(object).interp("foo", 0, 1).during(10);

        animation.cycle(50);

        object.foo = 0;

        animation.cycle(50);

        expect(object.foo).toBe(0);
        expect(animation.elapsed).toBe(10);
    });

    it("can have a custom easing function", () => {
        const easing = jasmine.createSpy().and.returnValue(0.5);

        const animation = new Animation(object)
            .interp("foo", 12, 14, easing)
            .during(10);

        animation.cycle(5);

        expect(object.foo).toBe(13);
        expect(easing).toHaveBeenCalledWith(0.5);
    });

    it("can have a progress callback", () => {
        const progress = jasmine.createSpy();

        const animation = new Animation(object)
            .interp("foo", 0, 1)
            .progress(progress)
            .during(10);

        animation.cycle(5);

        expect(progress).toHaveBeenCalledWith(0.5);
    });

    it("can have a custom apply function", () => {
        const apply = jasmine.createSpy();
        const easing = {} as Easing;

        const animation = new Animation(object)
            .interp("foo", 0, 1, easing)
            .apply(apply)
            .during(10);

        animation.cycle(5);

        expect(apply).toHaveBeenCalledWith(easing, 10, 0, 1, 5);
    });

    it("can skip", () => {
        const animation = new Animation(object).interp("foo", 0, 1);

        animation.skip();

        expect(object.foo).toBe(1);
    });

    it("can run on a nested property", () => {
        const animation = new Animation(object)
            .interp("bar.baz", 10, 20)
            .during(10);

        animation.cycle(5);

        expect(object.bar.baz).toBe(15);
    });

    it("can be given a new duration before it starts", () => {
        const animation = new Animation(object).interp("bar", 10, 20).during(5);

        animation.duration = 2;

        animation.cycle(5);

        expect(animation.finished).toBe(true);
        expect(object.bar).toBe(20);
    });

    it("can be given a new duration after it has been started", () => {
        const animation = new Animation(object).interp("bar", 0, 10).during(20);

        animation.cycle(5);

        animation.duration = 10;

        animation.cycle(0);

        expect(animation.finished).toBe(false);
        expect(object.bar).toBe(5);
    });

    it("can interpolate from a value to the current one", () => {
        const object = { x: 0 };

        const animation = new Animation(object).interpFrom("x", 100).during(20);

        animation.cycle(10);

        expect(object.x).toBe(50);
    });

    it("can interpolate from a value offset to the current value", () => {
        const object = { x: 100 };

        const animation = new Animation(object)
            .interpFromOffset("x", 50)
            .during(20);

        animation.cycle(10);

        expect(object.x).toBe(125);
    });

    it("can interpolate to a value from the current one", () => {
        const object = { x: 0 };

        const animation = new Animation(object).interpTo("x", 100).during(20);

        animation.cycle(10);

        expect(object.x).toBe(50);
    });

    it("can interpolate to an offset from the current value", () => {
        const object = { x: 100 };

        const animation = new Animation(object)
            .interpToOffset("x", 50)
            .during(20);

        animation.cycle(10);

        expect(object.x).toBe(125);
    });
});
