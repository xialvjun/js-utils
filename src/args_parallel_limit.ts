import { parallel_limit } from './parallel_limit';


export function args_parallel_limit<T extends (...args: any[]) => Promise<any>>(fn: T, count=1) {
  const args_fns = [];
  return <T>function(...args) {
    let args_fn = args_fns.find(it => it.args.length === args.length && it.args.every((arg, i) => arg = args[i]));
    if (args_fn) {
      return args_fn.fn.apply(this, args);
    }
    args_fn = { args, fn: parallel_limit(fn, count) };
    args_fns.push(args_fn);
    return args_fn.fn.apply(this, args);
  }
}
