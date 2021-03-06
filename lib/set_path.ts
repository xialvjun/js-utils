import { get_path } from "./get_path";
import { is_array } from "./to_string";

/**
 * 不修改原对象，设置 obj 的 path 路径的值为 value，得到新的对象
 * lodash 本有个简单的 set_path... https://github.com/lodash/lodash/issues/1696
 * ```js
 * import {clone, setWith, curry} from 'lodash/fp';
 * export const set_path = curry((obj, path, value) => setWith(clone, path, value, clone(obj)));
 * ```
 * 另外也有一些强类型的此类方法的库 https://github.com/lodash/lodash/issues/1696#issuecomment-353016126
 * like monolite(https://github.com/kube/monolite) or immutable-assign(https://github.com/engineforce/ImmutableAssign)
 * 但在前端不太注重强类型的情况下，使用起来终究是没有 lodash 的这种来得方便...
 * ! 但是 lodash 拼出来的 set_path 有 bug: 在遇到 set_path({ a: { b: 1, c: null }, d: "xxx" }, 'a.c.e', 2) => 对象未发生变化
 * 即它无法影响 null... 于是自己写一个简单的版本
 * * 支持设置 set_path(a, ['b', 'c.d', 'e'], 3) === a.b['c.d'].e=3
 * @param obj
 * @param path
 * @param value
 */
export function set_path<T>(obj: T, path: string | number | (string | number)[], value: any): T {
  if (typeof path === "number") {
    return set_path(obj, [path], value);
  }
  if (typeof path === "string") {
    path = path
      .split(/[\.\[\]\'\"]/g)
      .filter(v => v !== "")
      .map(s => {
        const idx = parseInt(s);
        if (idx > -1 && idx + "" === s) {
          return idx;
        }
        return s;
      });
    return set_path(obj, path, value);
  }
  if (path.length === 0) {
    return value;
  }
  if (path.length === 1) {
    const path_0 = path[0];
    let clone: any = { ...obj };
    if (typeof obj !== "object" || obj === null) {
      clone = typeof path_0 === "number" ? [] : {};
    }
    if (is_array(obj)) {
      clone = ((obj as any) as any[]).slice();
    }
    clone[path_0] = value;
    return clone;
  }
  const tail = set_path(get_path(obj, path.slice(0, -1)), path.slice(-1), value);
  return set_path(obj, path.slice(0, -1), tail);
}

export const set = set_path;

// export function old_set_path<T>(obj: T, path: string, value): T {
//   const paths = path.split(/[\.\[\]\'\"]/g).filter(v => v!=='').map(s => {
//     const idx = parseInt(s);
//     if ((idx > -1) && (idx + '' === s)) {
//       return idx;
//     }
//     return s;
//   });
//   function set(obj, paths, value) {
//     if (paths.length === 0) {
//       return value;
//     }
//     if (paths.length === 1) {
//       const paths_0 = paths[0];
//       if (typeof paths_0 === 'number') {
//         const clone = (obj || []).slice();
//         clone[paths_0] = value;
//         return clone;
//       }
//       return Object.assign({}, obj, { [paths_0]: value });
//     }
//     const tail = set(get_path(obj, paths.slice(0, -1)), paths.slice(-1), value);
//     return set(obj, paths.slice(0, -1), tail);
//   }
//   return set(obj, paths, value);
// }
