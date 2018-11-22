"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 返回一个可以任意执行，但内部并发只有 count 的函数
function parallel_limit(fn, count) {
    if (count === void 0) { count = 1; }
    var ps = [];
    var working = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            ps.push({ resolve: resolve, reject: reject, args: args });
            work();
        });
    };
    function work() {
        if (working >= count) {
            return;
        }
        var next = ps.shift();
        if (next) {
            working++;
            fn.apply(void 0, next.args).then(function (_) {
                working--;
                setTimeout(work, 0);
                next.resolve(_);
            })
                .catch(function (e) {
                working--;
                setTimeout(work, 0);
                next.reject(e);
            });
        }
    }
}
exports.parallel_limit = parallel_limit;
