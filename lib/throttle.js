"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throttle(fn, ms) {
    var t = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = Date.now();
        if (!((now - t) <= ms)) {
            t = now;
            return fn.apply(void 0, args);
        }
        return throttle.No_RUN;
    };
}
exports.throttle = throttle;
throttle.No_RUN = Symbol('throttle_no_run');
