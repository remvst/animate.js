'use strict';

const Loop = require('../src/loop');

describe('a loop', () => {

    it('has an infinite duration', () => {
        const loop  = new Loop(3, () => {});

        expect(loop.duration).toBe(Infinity);
    });

    it('can have a zero cycle', () => {
        const callback = jasmine.createSpy();
        const loop  = new Loop(3, callback);

        loop.cycle(0);

        expect(callback).not.toHaveBeenCalled();
    });

    it('can have a small cycle', () => {
        const callback = jasmine.createSpy();
        const loop  = new Loop(3, callback);

        loop.cycle(2.5);

        expect(callback).not.toHaveBeenCalled();
    });

    it('can have a cycle that triggers the callback', () => {
        const callback = jasmine.createSpy();
        const loop  = new Loop(3, callback);

        loop.cycle(3);

        expect(callback.calls.count()).toBe(1);
    });

    it('can have a cycle that triggers the callback twice', () => {
        const callback = jasmine.createSpy();
        const loop  = new Loop(3, callback);

        loop.cycle(6);

        expect(callback.calls.count()).toBe(2);
    });

    it('can have an initial delay', () => {
        const callback = jasmine.createSpy();
        const loop  = new Loop(3, callback, 10);

        loop.cycle(6);
        expect(callback.calls.count()).toBe(0);

        loop.cycle(4);
        expect(callback.calls.count()).toBe(1);

        loop.cycle(3);
        expect(callback.calls.count()).toBe(2);
    });

});
