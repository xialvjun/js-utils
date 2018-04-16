// ! task/cache_resolved_promise 得到的第一次的 promise 与 第二次的 promise 是不一样的。。。如果第一次的 promise throw 了，则第二次的是一个全新的 promise
// ! 事实上每次都是一个全新的 promise，因为 catch 就是生成一个新的 promise 对象

// ! 还应有一种只要两次请求是连在一起的，则保证返回同一个 promise 。。。这两种应该区分开。。。
// ! 也就是说第一种只缓存正确的 promise，第二种则仅仅是缓存 promise 无论对错
export function cache_pending_promise<T extends (...args: any[]) => Promise<any>>(fn: T) {
  let p = null;
  return <(...args: any[]) => ReturnType<T>>function () {
    const args = arguments;
    if (!!p) {
      return p;
    }
    p = fn.apply(this, args)
      .then(r => {
        p = null;
        return r;
      }).catch(e => {
        p = null;
        throw e;
      });
    return p;
  }
}
