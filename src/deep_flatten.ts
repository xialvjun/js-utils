export function deep_flatten(list) {
  list = [].concat(list);
  let length = 0;
  while (list.length !== length) {
    length = list.length;
    list = list.reduce((acc, cv) => acc.concat(cv), []);
  }
  return list;
}
