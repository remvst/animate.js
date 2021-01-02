import BaseAnimation from './base-animation';
export default class Action extends BaseAnimation {
    private _callback;
    private _called;
    constructor(callback: () => void);
    cycle(elapsed: number): void;
    get finished(): boolean;
}
