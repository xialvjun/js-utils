/**
 * 简易版的 lodash.get 。。。因为有了个自己写的 set_path，对称？
 * @param obj
 * @param path
 * @param default_value
 */
export function get_path(
  obj,
  path: string | number | (string | number)[],
  default_value?
) {
  if (obj === undefined) {
    return default_value;
  }
  if (typeof path === "number") {
    path = path + "";
  }
  let paths = <(string | number)[]>path;
  if (typeof path === "string") {
    paths = path
      .split(/[\.\[\]\'\"]/g)
      .filter(v => v !== "")
      .map(s => {
        const idx = parseInt(s);
        if (idx > -1 && idx + "" === s) {
          return idx;
        }
        return s;
      });
  }
  if (paths.length === 0) {
    return obj;
  }
  let head = undefined;
  if (obj !== null) {
    head = obj[paths[0]];
  }
  return get_path(head, paths.slice(1), default_value);
}
