import { to_string } from './to_string';

const is_array = (obj: any) => to_string(obj) === '[object Array]';

const merge2 = (a: any, b: any) => {
  // 如果 b 是 null 或 原始类型, 直接返回 b
  // a 必须是 数组 或者 非空对象, 否则返回 b
  if (
    b === null ||
    typeof b !== 'object' ||
    !(typeof a === 'object' && a !== null)
  ) {
    return b;
  }
  // 此时 a,b 都是数组 或者 非空对象
  let res = is_array(b) ? [] : {};
  Object.keys(a).forEach((k) => (res[k] = a[k]));
  Object.keys(b).forEach((k) => (res[k] = merge2(res[k], b[k])));
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
export function merge(...objs: any[]) {
  return objs.reduce((acc, cv) => merge2(acc, cv), undefined);
  // objs = objs.filter((it) => typeof it === 'object' && it !== null);
  // if (objs.length === 0) {
  //   return undefined;
  // }
  // let res: any = is_array(objs[0]) ? [] : {...objs[0]};
  // // const res: any = {};
  // for (const it of objs) {
  //   for (const key in it) {
  //     if (Object.prototype.hasOwnProperty.call(it, key)) {
  //       const value = it[key];
  //       if (value === undefined) {
  //         continue;
  //       }
  //       if (typeof value === 'object' && value !== null) {
  //         res[key] = merge(res[key], value);
  //       }
  //       res[key] = value;
  //     }
  //   }
  // }
  // return res;
}

// const defineProperties = (obj, props) => {
//   const cew = { configurable: true, enumerable: true, writable: true };
//   Object.defineProperties(
//     obj,
//     Object.keys(props).reduce((acc, key) => {
//       acc[key] = { ...cew, value: props[key] };
//       return acc;
//     }, {}),
//   );
// };
