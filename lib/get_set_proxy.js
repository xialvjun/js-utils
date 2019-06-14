"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var to_string_1 = require("./to_string");
var symbol = Symbol('$$__get_set_proxy__$$');
// ! 这里 proxy+symbol 可以用于 全局状态管理和局部状态管理. 这里的方便的地方是 get 不会报错, 类似 lodash.get 方法...
// 不过, 真正严格的程序, 还是应该能保证数据有正确的初始值, 但这扔不妨碍 proxy 很方便, 至少它可以不用太多的检测 api 结果
// 从而 proxy(res).data.list.map(item => <div/>), 不必 res && res.data && res.data.list
/**
 * 用法:
 * ```ts
 * const s = proxy.symbol;
 * let p = proxy({a:{b:123, c:[1,2,3], d:[{e:1},{e:2},{e:3}]}}, (n, o) => console.log('new one is:', n, '\n', 'and old one is:', o));
 * assert(p.a.b[s] === 123);
 * assert(p[s].a.b === 123);
 * assertNotThrowError(() => p.wrong.wrong[s] === undefined);
 * assertThrowError(() => p[s].wrong.wrong === undefined);
 * p.a.b = 234;
 * assert(add_10(p.a.b[s]) === (234+10));
 * p.a.c = [2,3,4];
 * assert(_.isEqual(p.a.c[s], [2,3,4]));
 * p.a.c[0] = 10;
 * assert(_.isEqual(p.a.c[s], [10,3,4]));
 * assert(p.a.c[0][s] === 10);
 * assert(_.isEqual(p.a.d[s], [{e:1},{e:2},{e:3}]));
 * p.a.d[0].e = 10;
 * assert(_.isEqual(p.a.d[s], [{e:10},{e:2},{e:3}]));
 * assertNotThrowError(() => p.a.d.map(it => it.f.g[s]));
 * assertThrowError(() => p.a.d[s].map(it => it.f.g));
 * ```
 * if want addEventListener, write `listeners = fn[]` outside
 */
function proxy(base, onChange) {
    var proxy_instance = new Proxy({}, {
        get: function (t, p, r) {
            if (p == symbol) {
                return base;
            }
            try {
                var v = base[p];
                if (to_string_1.to_string(v) === '[object Array]') {
                    var pv_1 = proxy(v, function (n, o) { return (proxy_instance[p] = n); });
                    var rs = v.map(function (it, idx) { return proxy(it, function (n, o) { return (pv_1[idx] = n); }); });
                    rs[symbol] = v;
                    return rs;
                }
                return proxy(v, function (n, o) { return (proxy_instance[p] = n); });
            }
            catch (error) {
                return proxy(undefined, function (n, o) { return (proxy_instance[p] = n); });
            }
        },
        set: function (t, p, v, r) {
            var _a;
            var o = base;
            if (to_string_1.to_string(base) === '[object Array]') {
                base = base.slice();
                base[p] = v;
            }
            else {
                base = __assign({}, base, (_a = {}, _a[p] = v, _a));
            }
            onChange && onChange(base, o);
            return true;
        },
    });
    return proxy_instance;
}
exports.proxy = proxy;
proxy.s = symbol;
