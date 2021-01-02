'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const base_animation_1 = require("./base-animation");
class Action extends base_animation_1.default {
    constructor(callback) {
        super();
        this._callback = callback;
        this._called = false;
    }
    cycle(elapsed) {
        super.cycle(elapsed);
        this._called = true;
        this._callback();
    }
    get finished() {
        return super.finished || this._called;
    }
}
exports.default = Action;
