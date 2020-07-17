type PromiseFunction = (...args: any[]) => Promise<any>;

export function try_times<T extends PromiseFunction>(fn: T, times = 1) {
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
