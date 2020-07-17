import { parallel_limit, PromiseFn } from "./parallel_limit";

export function args_parallel_limit<T extends PromiseFn>(
  fn: T,
  count = 1
) {
  const args_fns: any[] = [];
  return <T>function(...args) {
    let args_fn = args_fns.find(
      it =>
        it.args.length === args.length &&
        it.args.every((arg: any, i: number) => (arg = args[i]))
    );
    if (args_fn) {
      return args_fn.fn(...args);
    }
    args_fn = { args, fn: parallel_limit(fn, count) };
    args_fns.push(args_fn);
    return args_fn.fn(...args);
  };
}
