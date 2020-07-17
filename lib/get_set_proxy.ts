import { to_string } from './to_string';

const symbol = Symbol('$$__get_set_proxy__$$');
// type proxy<T> = (T extends (infer R)[] ? (proxy<R>)[] : ({ [P in keyof T]: proxy<T[P]> })) & { [symbol]: T }
type proxy<T, S extends string> = { [symbol]: T} & { [K in S]: T } & { [P in keyof T]: proxy<T[P], S> };

// ! 这里 proxy+symbol 可以用于 全局状态管理和局部状态管理. 这里的方便的地方是 get 不会报错, 类似 lodash.get 方法...
// 不过, 真正严格的程序, 还是应该能保证数据有正确的初始值, 但这扔不妨碍 proxy 很方便, 至少它可以不用太多的检测 api 结果
// 从而 proxy(res).data.list.map(item => <div/>), 不必 res && res.data && res.data.list
// alternative: https://github.com/dobjs/dob

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
export function proxy<T, S extends string>(base: T, onChange?: (n: T, o: T) => any, str_symbol?: S) {
  // if (to_string(base) === '[object Array]') {
  //   const pv = proxy(base, (n, o) => (proxy_instance[p] = n as any), str_symbol);
  //   const rs = ((base as any) as any[]).map((it, idx) => proxy(it, (n, o) => ((pv as any)[idx] = n), str_symbol));
  //   (rs as any)[symbol] = base;
  //   return rs;
  // }
  const proxy_instance = new Proxy(
    base as any,
    {
      get(t, p: (keyof T) | (typeof symbol), r) {
        if (p == symbol || (p as any) == str_symbol) {
          return base;
        }
        try {
          let v = base[p];
          const pv = proxy(v, (n, o) => (proxy_instance[p] = n as any), str_symbol);
          if (to_string(v) === '[object Array]') {
            const rs = ((v as any) as any[]).map((it, idx) => proxy(it, (n, o) => ((pv as any)[idx] = n), str_symbol));
            (rs as any)[symbol] = v;
            return rs;
          }
          return pv;
        } catch (error) {
          return proxy(undefined, (n, o) => (proxy_instance[p] = n as any), str_symbol);
        }
      },
      set(t, p: keyof T, v: T[typeof p], r) {
        const o = base;
        if (to_string(base) === '[object Array]') {
          base = (base as any).slice();
          base[p] = v;
        } else {
          base = { ...base, [p]: v };
        }
        onChange && onChange(base, o);
        return true;
      },
      apply(t, zis, args) {
        return t.apply(zis[symbol], args);
      },
    },
  ) as proxy<T, S>;
  return proxy_instance;
}
proxy.s = symbol;
