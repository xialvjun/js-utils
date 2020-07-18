import { is_array } from "./to_string";

export const merge2 = (a: any, b: any) => {
  if (b === undefined) {
    return a;
  }
  // 如果 b 是 null 或 原始类型, 直接返回 b
  // a 必须是 数组 或者 非空对象, 否则返回 b
  if (b === null || typeof b !== "object" || !(typeof a === "object" && a !== null)) {
    return b;
  }
  // 此时 a,b 都是数组 或者 非空对象
  let res: any = is_array(b) ? [] : {};
  Object.keys(a).forEach(k => (res[k] = a[k]));
  Object.keys(b).forEach(k => (res[k] = merge2(res[k], b[k])));
  return res;
};

/**
 * ! not merge primitive type cause not know how lodash.merge can assign BigInt ... _.merge(123n, {a:123}) is ok, but new BigInt() is not
 * merge(1,2,3,4,5) === 5
 * merge(undefined, {a: 123}, {b:234}) === {a:123,b:234}
 * merge({a:123}, 2, 3) === 3
 * merge({a:123}, 2, 3, null) === null
 * merge({a:123}, [1,2,3]) === [ 1, 2, 3, a: 123 ]
 * merge([1,2,3], {a:123}) === {0:1,1:2,2:3,a:123}
 * @param objs
 */
export function merge(...objs: any[]): any {
  // return objs.reduce((acc, cv) => merge2(acc, cv), undefined);
  // * better performance
  return objs.reduceRight((acc, cv) => merge2(cv, acc), undefined);
}
