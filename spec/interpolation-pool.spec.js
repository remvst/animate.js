'use strict';

const InterpolationPool = require('../src/interpolation-pool');
const Animation = require('../src/animation');

describe('an interpolation pool', () => {

    let pool;

    beforeEach(() => {
        pool = new InterpolationPool();
    });

    it('can have animations', () => {
        new Animation()
            .run(pool);

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

});
