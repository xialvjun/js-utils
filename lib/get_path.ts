/**
 * 简易版的 lodash.get ...
 * * 另外要支持 a.b['c.d'].e = get(a, ['b', 'c.d', 'e']), 即, path 是数组的话, 里面的字符串不再分割
 * get(null, 'a.b.c', 1) === 1
 * get({a: {'b.c': 2, d: [1,2,3]}}, ['a', 'b.c']) === 2
 * get({a: {'b.c': 2, d: [1,2,3]}}, ['a', 'd.0']) === undefined
 * get({a: {'b.c': 2, d: [1,2,3]}}, ['a', 'd', 0]) === 1
 * get({a: {'b.c': 2, d: [1,2,3]}}, ['a', 'd', '1']) === 2
 * @param obj
 * @param path
 * @param default_value
 */
export function get_path(obj: any, path: string | number | (string | number)[], default_value?: any): any {
  if (obj === undefined) {
    return default_value;
  }
  if (typeof path === "string") {
    path = path.split(/[\.\[\]\'\"]/g).filter(v => v !== "");
    return get_path(obj, path, default_value);
  }
  if (typeof path === "number") {
    path = [path];
  }
  if (path.length === 0) {
    return obj;
  }
  return get_path(obj?.[path[0]], path.slice(1), default_value);
}

export const get = get_path;
