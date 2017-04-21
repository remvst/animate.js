'use strict';

const DynamicTimeline = require('../src/dynamic-timeline');
const Timeline = require('../src/timeline');
const Animation = require('../src/animation');

describe('a dynamic timeline', () => {

    it('can be instantiated', () => {
        const build = jasmine.createSpy();
        const dtl = new DynamicTimeline(123, build);

        expect(dtl.size).toBe(1);
        expect(dtl.duration).toBe(123);
        expect(dtl.isFinished()).toBe(false);
        expect(build).not.toHaveBeenCalled();
    });

    it('can be built on its first cycle', () => {
        const dtl = new DynamicTimeline(123, () => {
            return new Timeline()
                .add(new Animation({}).interp('foo', 0, 1).during(1))
                .add(new Animation({}).interp('foo', 0, 1).during(1));
        });

        dtl.cycle(0);

        expect(dtl.size).toBe(2);
        expect(dtl.duration).toBe(123);
        expect(dtl.isFinished()).toBe(false);
    });

    it('can be built and run', () => {
        const object = {};

        const dtl = new DynamicTimeline(123, () => {
            return new Timeline()
                .add(new Animation(object).interp('foo', 0, 1).during(1))
                .add(new Animation(object).interp('foo', 0, 1).during(1));
        });

        dtl.cycle(0.5);

        expect(dtl.size).toBe(2);
        expect(dtl.isFinished()).toBe(false);
        expect(object.foo).toBe(0.5);
    });

    it('only builds once', () => {
        const build = jasmine.createSpy().and.returnValue(new Timeline().wait(1));
        const dtl = new DynamicTimeline(123, build);

        dtl.cycle(0);
        dtl.cycle(0);

        expect(dtl.size).toBe(0);
        expect(dtl.duration).toBe(123);
        expect(dtl.isFinished()).toBe(false);
        expect(build.calls.count()).toBe(1);
    });

    it('isn\'t finished if it hasn\'t been built yet', () => {
        const dtl = new DynamicTimeline(123, () => {});

        expect(dtl.isFinished()).toBe(false);
    });

    it('isn\'t finished if its child isn\'t finished', () => {
        const dtl = new DynamicTimeline(1, () => {
            return new Timeline()
                .wait(100);
        });

        dtl.cycle(10);

        expect(dtl.isFinished()).toBe(false);
    });

    it('can be skipped', () => {
        const child = new Timeline().wait(5);
        spyOn(child, 'skip').and.callThrough();

        const dtl = new DynamicTimeline(10, () => child);

        dtl.skip();

        expect(dtl.isFinished()).toBe(true);
        expect(child.isFinished()).toBe(true);
        expect(child.skip).toHaveBeenCalled();
    });

});
