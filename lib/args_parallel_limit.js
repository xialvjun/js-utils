"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parallel_limit_1 = require("./parallel_limit");
function args_parallel_limit(fn, count) {
    if (count === void 0) { count = 1; }
    var args_fns = [];
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var args_fn = args_fns.find(function (it) { return it.args.length === args.length && it.args.every(function (arg, i) { return arg = args[i]; }); });
        if (args_fn) {
            return args_fn.fn.apply(this, args);
        }
        args_fn = { args: args, fn: parallel_limit_1.parallel_limit(fn, count) };
        args_fns.push(args_fn);
        return args_fn.fn.apply(this, args);
    };
}
exports.args_parallel_limit = args_parallel_limit;
