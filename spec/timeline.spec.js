'use strict';

const Timeline = require('../src/timeline');
const Animation = require('../src/animation');

describe('a timeline', () => {

    describe('can be instantiated and ', () => {

        it('be empty', () => {
            const tl = new Timeline();

            expect(tl.duration).toBe(0);
            expect(tl.size).toBe(0);
        });

        it('add functions', () => {
            const tl = new Timeline()
                .add(() => {});

            expect(tl.duration).toBe(0);
            expect(tl.size).toBe(1);
        });

        it('add animations', () => {
            const tl = new Timeline()
                .add(new Animation().during(123));

            expect(tl.duration).toBe(123);
            expect(tl.size).toBe(1);
        });

        it('add animations at specific times', () => {
            const tl = new Timeline()
                .add(123, new Animation().during(3));

            expect(tl.duration).toBe(126);
            expect(tl.size).toBe(1);
        });

        it('wait', () => {
            const tl = new Timeline()
                .wait(123);

            expect(tl.duration).toBe(123);
            expect(tl.size).toBe(0);
        });

        it('have a series of animations', () => {
            const tl = new Timeline()
                .add(new Animation().during(3))
                .add(new Animation().during(5));

            expect(tl.duration).toBe(8);
            expect(tl.size).toBe(2);
        });

        it('have a series of animations at its start', () => {
            const tl = new Timeline()
                .add(0, new Animation().during(3))
                .add(0, new Animation().during(5));

            expect(tl.duration).toBe(5);
            expect(tl.size).toBe(2);
        });

        it('have a series of animations with delays', () => {
            const tl = new Timeline()
                .wait(2)
                .add(new Animation().during(3))
                .wait(3)
                .add(new Animation().during(5));

            expect(tl.duration).toBe(13);
            expect(tl.size).toBe(2);
        });

        it('have a series of animations with delays and breakpoints', () => {
            const tl = new Timeline()
                .wait(2)
                .add(new Animation().during(3))
                .addBreakpoint()
                .wait(3)
                .add(
                    new Timeline()
                        .add(new Animation().during(2))
                )
                .add(new Animation().during(5));

            expect(tl.duration).toBe(15);
            expect(tl.size).toBe(3);
        });

        it('can calculate its size when running', () => {
            const tl = new Timeline()
                .add(new Animation({}).interp('foo', 0, 1).during(2))
                .add(
                    new Timeline()
                        .add(0, new Animation({}).interp('foo', 0, 1).during(3))
                        .add(0, new Animation({}).interp('foo', 0, 1).during(4))
                )
                .add(new Animation({}).interp('foo', 0, 1).during(5));

            tl.cycle(3);

            expect(tl.size).toBe(3);
        });

    });

    describe('can be run with a linear structure', () => {
        let f1, f2, f3;
        let a1, a2, a3;
        let tl;

        beforeEach(() => {
            f1 = jasmine.createSpy('f1');
            f2 = jasmine.createSpy('f2');
            f3 = jasmine.createSpy('f3');

            a1 = new Animation({}).interp('foo', 0, 1).during(1);
            a2 = new Animation({}).interp('foo', 0, 1).during(2);
            a3 = new Animation({}).interp('foo', 0, 1).during(3);

            spyOn(a1, 'cycle').and.callThrough();
            spyOn(a2, 'cycle').and.callThrough();
            spyOn(a3, 'cycle').and.callThrough();

            tl = new Timeline()
                .add(f1)
                .add(f2)
                .wait(2)
                .add(a1)
                .add(f3)
                .wait(3)
                .add(a2)
                .addBreakpoint()
                .add(a3);
        });

        it('but not until it cycles', () => {
            expect(f1.calls.count()).toBe(0);
            expect(f2.calls.count()).toBe(0);
            expect(tl.duration).toBe(a1.duration + a2.duration + a3.duration + 2 + 3);
        });

        it('with a zero cycle', () => {
            tl.cycle(0);
            tl.cycle(0);

            expect(f1.calls.count()).toBe(1);
            expect(f2.calls.count()).toBe(1);
        });

        it('with a cycle that doesn\'t hit anything', () => {
            tl.cycle(1);

            expect(f1.calls.count()).toBe(1);
            expect(f2.calls.count()).toBe(1);
            expect(a1.elapsed).toBe(0);
            expect(a1.cycle).not.toHaveBeenCalled();
        });

        it('with a cycle that hits the first animation', () => {
            tl.cycle(2.5);

            expect(tl.elapsed).toBe(2.5);
            expect(f1.calls.count()).toBe(1);
            expect(f2.calls.count()).toBe(1);
            expect(a1.cycle).toHaveBeenCalledWith(0.5);
            expect(f3.calls.count()).toBe(0);
        });

        it('with a cycle that hits everything', () => {
            tl.cycle(100);

            expect(tl.isFinished()).toBe(true);
            expect(tl.elapsed).toBe(11);
            expect(f1.calls.count()).toBe(1);
            expect(f2.calls.count()).toBe(1);
            expect(a1.cycle).toHaveBeenCalledWith(9);
            expect(f3.calls.count()).toBe(1);
            expect(a2.cycle).toHaveBeenCalledWith(5);
            expect(a3.cycle).toHaveBeenCalledWith(3);
        });

        it('with several cycles that hit everything', () => {
            for (let t = 0 ; t < 100 ; t += 0.1) {
                tl.cycle(0.1);
            }

            expect(tl.isFinished()).toBe(true);
            expect(tl.elapsed).toBe(11);
            expect(a1.elapsed).toBe(1);
            expect(a2.elapsed).toBe(2);
            expect(a3.elapsed).toBe(3);
        });

        it('and skip to a breakpoint', () => {
            tl.skip();

            expect(tl.isFinished()).toBe(false);
            expect(tl.elapsed).toBe(8);
            expect(f1.calls.count()).toBe(1);
            expect(f2.calls.count()).toBe(1);
            expect(a1.cycle).toHaveBeenCalledWith(6);
            expect(f3.calls.count()).toBe(1);
            expect(a2.cycle).toHaveBeenCalledWith(2);
            expect(a3.cycle).toHaveBeenCalledWith(0);
        });
    });

    describe('can be run with a tree structure', () => {
        let a11, a12, a1, a21, a22;
        let tl, stl1, stl2, stl11;

        beforeEach(() => {
            stl11 = new Timeline();

            stl1 = new Timeline()
                .add(0, a11 = new Animation({}).interp('foo', 0, 1).during(2))
                .add(0, stl11)
                .add(0, a12 = new Animation({}).interp('foo', 0, 1).during(2));

            stl2 = new Timeline()
                .add(a21 = new Animation({}).interp('foo', 0, 1).during(2))
                .addBreakpoint()
                .add(a22 = new Animation({}).interp('foo', 0, 1).during(2));

            tl = new Timeline()
                .add(stl1)
                .addBreakpoint()
                .add(stl2)
                .add(a1 = new Animation({}).interp('foo', 0, 1).during(3));

            spyOn(stl1, 'cycle').and.callThrough();
            spyOn(a11, 'cycle').and.callThrough();
            spyOn(a12, 'cycle').and.callThrough();
            spyOn(stl11, 'cycle').and.callThrough();

            spyOn(a1, 'cycle').and.callThrough();

            spyOn(stl2, 'cycle').and.callThrough();
            spyOn(a21, 'cycle').and.callThrough();
            spyOn(a22, 'cycle').and.callThrough();
        });

        it('has the correct duration and size', () => {
            expect(tl.duration).toBe(9);
            expect(tl.size).toBe(5);
        });

        it('can skip to the first breakpoint', () => {
            tl.skip();

            expect(tl.elapsed).toBe(2);

            expect(a11.elapsed).toBe(2);
            expect(a12.elapsed).toBe(2);

            expect(a21.elapsed).toBe(0);
            expect(a22.elapsed).toBe(0);

            expect(a1.elapsed).toBe(0);
        });

        it('can skip to the second breakpoint', () => {
            tl.skip();
            tl.skip();

            expect(tl.elapsed).toBe(4);

            expect(a11.elapsed).toBe(2);
            expect(a12.elapsed).toBe(2);

            expect(a21.elapsed).toBe(2);
            expect(a22.elapsed).toBe(0);

            expect(a1.elapsed).toBe(0);
        });

        it('can skip to the end', () => {
            tl.skip();
            tl.skip();
            tl.skip();

            expect(tl.elapsed).toBe(9);

            expect(a11.elapsed).toBe(2);
            expect(a12.elapsed).toBe(2);

            expect(a21.elapsed).toBe(2);
            expect(a22.elapsed).toBe(2);

            expect(a1.elapsed).toBe(3);
        });
    });

    it('can be cancelled', () => {
        const a1 = new Animation({}).interp('foo', 0, 1).during(1);
        const a2 = new Animation({}).interp('foo', 0, 1).during(1);

        spyOn(a1, 'cancel');
        spyOn(a2, 'cancel');

        const tl = new Timeline()
            .add(a1)
            .add(a2);

        tl.cycle(0.5);
        tl.cancel();

        expect(a1.cancel).toHaveBeenCalled();
        expect(a2.cancel).toHaveBeenCalled();
    });

    it('runs actions only once', () => {
        const action = jasmine.createSpy();

        const timeline = new Timeline()
            .add(action);

        timeline.cycle(0);
        timeline.cycle(0);

        expect(action.calls.count()).toBe(1);
    });

    it('runs children in the right order', () => {
        const c1 = new Animation({}).interp('foo', 0, 1).during(1);
        const c2 = new Animation({}).interp('foo', 0, 1).during(1);
        const c3 = new Animation({}).interp('foo', 0, 1).during(1);
        const c4 = new Animation({}).interp('foo', 0, 1).during(1);
        const c5 = new Animation({}).interp('foo', 0, 1).during(1);
        const c6 = new Animation({}).interp('foo', 0, 1).during(1);

        const order = [];

        spyOn(c1, 'cycle').and.callFake(() => {
            order.push(c1);
        });

        spyOn(c2, 'cycle').and.callFake(() => {
            order.push(c2);
        });

        spyOn(c3, 'cycle').and.callFake(() => {
            order.push(c3);
        });

        spyOn(c4, 'cycle').and.callFake(() => {
            order.push(c4);
        });

        spyOn(c5, 'cycle').and.callFake(() => {
            order.push(c5);
        });

        spyOn(c6, 'cycle').and.callFake(() => {
            order.push(c6);
        });

        const timeline = new Timeline()
            .add(10, c1)
            .add(9, c2)
            .add(8, c3)
            .add(7, c4)
            .add(6, c5)
            .add(5, c6)
            .add(10, () => {});

        timeline.cycle(10);

        expect(order).toEqual([c6, c5, c4, c3, c2, c1]);
        expect(timeline.duration).toBe(11);
    });

    it('runs breakpoints in the right order', () => {
        const tl = new Timeline()
            .add(5, new Timeline()
                .add(new Animation({}).interp('foo', 0, 1))
                .addBreakpoint())
            .add(2, new Timeline()
                .add(new Animation({}).interp('foo', 0, 1))
                .addBreakpoint());

        tl.skip();

        expect(tl.elapsed).toBe(3);
    });

});
