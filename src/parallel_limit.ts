// 返回一个可以任意执行，但内部并发只有 count 的函数
export function parallel_limit<T extends (...params: any[]) => Promise<any>>(fn: T, count=1) {
  const ps = [];
  let working = 0;
  return <T>function() {
    // 把返回的箭头函数改为普通函数，并且修改 fn 的 this，从而让包装后的函数能被外界操纵 this...
    // 当然，如果传进来的 fn 已经是一个 bind this 之后的函数，那就无影响...
    // 整体上就是尊重外界传递的 fn 的绑定状态...适合于 @xialvjun/create-react-context 库
    const args = arguments;
    return new Promise((resolve, reject) => {
      ps.push({ resolve, reject, args, this: this });
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
      fn.apply(next.this, next.args)
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
