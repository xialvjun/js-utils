export function to_string(obj: any): string {
  return Object.prototype.toString.call(obj);
}

export const is_array = (obj: any) => to_string(obj) === "[object Array]";
