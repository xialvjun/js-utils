export type PromiseFn<P extends any[] = any[], R = any> = (...args: P) => Promise<R>;

// 返回一个可以任意执行，但内部并发只有 count 的函数
export function parallel_limit<T extends PromiseFn>(fn: T, count = 1) {
  const ps: any[] = [];
  let working = 0;
  return <T>function (...args) {
    return new Promise((resolve, reject) => {
      ps.push({ resolve, reject, args });
      work();
    });
  };
  function work() {
    if (working >= count) {
      return;
    }
    const next = ps.shift();
    if (next) {
      working++;
      fn(...next.args)
        .then(_ => {
          working--;
          setTimeout(work, 0);
          next.resolve(_);
        })
        .catch(e => {
          working--;
          setTimeout(work, 0);
          next.reject(e);
        });
    }
  }
}
