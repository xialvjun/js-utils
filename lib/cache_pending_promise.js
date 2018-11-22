"use strict";
// ! task/cache_resolved_promise 得到的第一次的 promise 与 第二次的 promise 是不一样的。。。如果第一次的 promise throw 了，则第二次的是一个全新的 promise
// ! 事实上每次都是一个全新的 promise，因为 catch 就是生成一个新的 promise 对象
Object.defineProperty(exports, "__esModule", { value: true });
function cache_pending_promise(fn) {
    var p = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!!p) {
            return p;
        }
        p = fn.apply(void 0, args).then(function (r) {
            p = null;
            return r;
        })
            .catch(function (e) {
            p = null;
            throw e;
        });
        return p;
    };
}
exports.cache_pending_promise = cache_pending_promise;
