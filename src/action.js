'use strict';

const BaseAnimation = require('./base-animation');

class Action extends BaseAnimation {

    constructor(callback) {
        super();
        this._callback = callback;
        this._called = false;
    }

    cycle(e) {
        super.cycle(e);
        this._called = true;
        this._callback();
    }

    isFinished() {
        return this._cancelled || this._called;
    }

}

module.exports = Action;
