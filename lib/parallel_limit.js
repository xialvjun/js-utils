"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 返回一个可以任意执行，但内部并发只有 count 的函数
function parallel_limit(fn, count) {
    if (count === void 0) { count = 1; }
    var ps = [];
    var working = 0;
    return function () {
        var _this = this;
        // 把返回的箭头函数改为普通函数，并且修改 fn 的 this，从而让包装后的函数能被外界操纵 this...
        // 当然，如果传进来的 fn 已经是一个 bind this 之后的函数，那就无影响...
        // 整体上就是尊重外界传递的 fn 的绑定状态...适合于 @xialvjun/create-react-context 库
        var args = arguments;
        return new Promise(function (resolve, reject) {
            ps.push({ resolve: resolve, reject: reject, args: args, this: _this });
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
            fn.apply(next.this, next.args)
                .then(function (_) {
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
