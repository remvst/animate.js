'use strict';

const Timeline = require('../src/timeline');
const Animation = require('../src/animation');

describe('a timeline', () => {

    describe('basic tests', () => {

        it('can be empty', () => {
            const tl = new Timeline();

            expect(tl.duration).toBe(0);
            expect(tl.size).toBe(0);
        });

        it('can add functions', () => {
            const tl = new Timeline()
                .add(() => {});

            expect(tl.duration).toBe(0);
            expect(tl.size).toBe(1);
        });

        it('can add animations', () => {
            const tl = new Timeline()
                .add(new Animation().during(123));

            expect(tl.duration).toBe(123);
            expect(tl.size).toBe(1);
        });

        it('can wait', () => {
            const tl = new Timeline()
                .wait(123);

            expect(tl.duration).toBe(123);
            expect(tl.size).toBe(0);
        });

    });

});
