export function throttle<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let t: number = null;
  return <T>function(...args) {
    const now = Date.now();
    if (!((now - t) <= ms)) {
      t = now;
      return fn(...args);
    }
    return throttle.No_RUN;
  };
}

throttle.No_RUN = Symbol('throttle_no_run');
