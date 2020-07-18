export function throttle<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let t: number = 0;
  return <T>function (...args) {
    const now = Date.now();
    if (now - t > ms) {
      t = now;
      return fn(...args);
    }
    return throttle.NO_RUN;
  };
}

throttle.NO_RUN = Symbol("$$__throttle_no_run__$$");
