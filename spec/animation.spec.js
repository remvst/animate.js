'use strict';

const Animation = require('../src/animation');

describe('an animation', () => {

    let object;

    beforeEach(function() {
        object = {
            'foo': 43,
            'bar': {
                'baz': 1
            }
        };
    });

    it('can be instantiated and have a default duration', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1);

        expect(animation.duration).toBe(1);
        expect(object.foo).toBe(43);
        expect(animation.elapsed).toBe(0);
    });

    it('can be instantiated and have a specific duration', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1)
            .during(123);

        expect(animation.duration).toBe(123);
        expect(object.foo).toBe(43);
    });

    it('can be instantiated and initialize the object', () => {
        new Animation(object)
            .interp('foo', 123456, 1)
            .init();

        expect(object.foo).toBe(123456);
    });

    it('can cycle with a zero delta', () => {
        const animation = new Animation(object)
            .interp('foo', 123456, 1)
            .during(10);

        animation.cycle(0);

        expect(object.foo).toBe(123456);
        expect(animation.elapsed).toBe(0);
    });

    it('can cycle with a small delta', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1)
            .during(10);

        animation.cycle(5);

        expect(object.foo).toBe(0.5);
        expect(animation.elapsed).toBe(5);
    });

    it('can cycle with a large delta', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1)
            .during(10);

        animation.cycle(50);

        expect(object.foo).toBe(1);
        expect(animation.elapsed).toBe(10);
    });

    it('does not do anything once it\'s over', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1)
            .during(10);

        animation.cycle(50);

        object.foo = 0;

        animation.cycle(50);

        expect(object.foo).toBe(0);
        expect(animation.elapsed).toBe(10);
    });

    it('can have a custom easing function', () => {
        const easing = jasmine.createSpy().and.returnValue(123);

        const animation = new Animation(object)
            .interp('foo', 12, 14, easing)
            .during(10);

        animation.cycle(5);

        expect(object.foo).toBe(123);
        expect(easing).toHaveBeenCalledWith(5, 12, 2, 10);
    });

    it('can have a progress callback', () => {
        const progress = jasmine.createSpy();

        const animation = new Animation(object)
            .interp('foo', 0, 1)
            .progress(progress)
            .during(10);

        animation.cycle(5);

        expect(progress).toHaveBeenCalledWith(0.5);
    });

    it('can have a custom apply function', () => {
        const apply = jasmine.createSpy();
        const easing = {};

        const animation = new Animation(object)
            .interp('foo', 0, 1, easing)
            .apply(apply)
            .during(10);

        animation.cycle(5);

        expect(apply).toHaveBeenCalledWith(easing, 10, 0, 1, 5);
    });

    it('can skip', () => {
        const animation = new Animation(object)
            .interp('foo', 0, 1);

        animation.skip();

        expect(object.foo).toBe(1);
    });

    it('can run on a nested property', () => {
        const animation = new Animation(object)
            .interp('bar.baz', 10, 20)
            .during(10);

        animation.cycle(5);

        expect(object.bar.baz).toBe(15);
    });

});
