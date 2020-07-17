import { PromiseFn } from "./parallel_limit";

export function try_times<T extends PromiseFn>(fn: T, times = 1) {
  return <T>async function(...args) {
    let t = times;
    let e = null;
    while (t > 0) {
      t--;
      try {
        return await fn(...args);
      } catch (error) {
        e = error;
      }
    }
    throw e;
  };
}
