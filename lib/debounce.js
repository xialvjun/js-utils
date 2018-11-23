"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function debounce(fn, ms) {
    var t = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(t);
        t = setTimeout(function () { return fn.apply(void 0, args); }, ms);
        return t;
    };
}
exports.debounce = debounce;
