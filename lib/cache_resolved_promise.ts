// 这个函数把定义任务与执行任务区分开。。。而且还会缓存任务结果，以及任务如果上次失败，则下次执行将会重新执行。。。
// 从而可以轻松构建全局可能会失败多次，但只会执行成功一次，的全局唯一懒执行任务
// 这个函数在理解时要注意不同的参数会返回不同的函数。。。也就是说需要预定义参数。。。memonize 不需要预定义参数

type PromiseFunction = (...args: any[]) => Promise<any>;

export function cache_resolved_promise<T extends PromiseFunction>(fn: T) {
  return (...args: Parameters<T>) => {
    let p = null;
    return (refresh?: boolean): ReturnType<T> =>
      (refresh || !p ? Promise.reject(false) : p).catch(e => {
        p = fn(...args);
        return p;
      });
  };
}

export const task = cache_resolved_promise;
