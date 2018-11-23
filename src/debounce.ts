export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let t: number = null;
  return function(...args: Parameters<T>) {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
    return t;
  };
}
