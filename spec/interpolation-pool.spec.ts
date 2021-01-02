'use strict';

import { InterpolationPool, Animation, Timeline } from '../src/index';

describe('an interpolation pool', () => {

    let pool: InterpolationPool;

    beforeEach(() => {
        pool = new InterpolationPool();
    });

    it('can have animations', () => {
        const a = new Animation({})
            .run(pool);

        expect(pool.size).toBe(1);
        expect(a.interpolationPool).toBe(pool);
    });

    it('can run animations', () => {
        const a1 = new Animation({})
            .interp('yolo', 0, 1)
            .during(2)
            .run(pool);
        const a2 = new Animation({})
            .interp('yolo', 0, 1)
            .during(3)
            .run(pool);

        spyOn(a1, 'cycle').and.callThrough();
        spyOn(a2, 'cycle').and.callThrough();

        pool.cycle(2.5);

        expect(a1.cycle).toHaveBeenCalledWith(2.5);
        expect(a2.cycle).toHaveBeenCalledWith(2.5);

        expect(pool.size).toBe(1);
    });

    it('can run animations', () => {
        const a1 = new Animation({})
            .interp('yolo', 0, 1)
            .during(2)
            .run(pool);
        const a2 = new Animation({})
            .interp('yolo', 0, 1)
            .during(3)
            .run(pool);
        const a3 = new Animation({})
            .interp('yolo', 0, 1)
            .during(4)
            .run(pool);

        spyOn(a1, 'cycle').and.callThrough();
        spyOn(a2, 'cycle').and.callThrough();
        spyOn(a3, 'cycle').and.callThrough();

        pool.cycle(2.5);

        expect(a1.cycle).toHaveBeenCalledWith(2.5);
        expect(a2.cycle).toHaveBeenCalledWith(2.5);
        expect(a3.cycle).toHaveBeenCalledWith(2.5);

        expect(pool.size).toBe(2);
    });

    it('can run a main animation and skip', () => {
        const tl = new Timeline()
            .runAsMain(pool);
        spyOn(tl, 'skip');

        pool.skip();

        expect(tl.skip).toHaveBeenCalled();
    });

    it('can run a main animation and clear it from memory when it\'s over', () => {
        const tl = new Timeline()
            .runAsMain(pool);
        spyOn(tl, 'skip');

        pool.cycle(10);
        pool.skip();

        expect(tl.skip).not.toHaveBeenCalled();
    });

    it('can skip with no main timeline', () => {
        expect(() => {
            pool.skip();
        }).not.toThrow();
    });

    it('can run a delay', () => {
        const callback = jasmine.createSpy();

        pool.delay(2, callback);

        expect(callback.calls.count()).toBe(0);
        expect(pool.size).toBe(1);

        pool.cycle(10);

        expect(callback.calls.count()).toBe(1);
        expect(pool.size).toBe(0);
    });

});
