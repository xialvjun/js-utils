"use strict";
// 这个函数把定义任务与执行任务区分开。。。而且还会缓存任务结果，以及任务如果上次失败，则下次执行将会重新执行。。。
// 从而可以轻松构建全局可能会失败多次，但只会执行成功一次，的全局唯一懒执行任务
// 这个函数在理解时要注意不同的参数会返回不同的函数。。。也就是说需要预定义参数。。。memonize 不需要预定义参数
Object.defineProperty(exports, "__esModule", { value: true });
function cache_resolved_promise(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var p = null;
        return function (refresh) {
            return (refresh || !p ? Promise.reject(false) : p).catch(function (e) {
                p = fn.apply(void 0, args);
                return p;
            });
        };
    };
}
exports.cache_resolved_promise = cache_resolved_promise;
exports.task = cache_resolved_promise;
