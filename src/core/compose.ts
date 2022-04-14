import { ComposeFunction, BaseFunction } from "../type/function";

export function compose<T extends BaseFunction, K extends BaseFunction[]>(
  f: T,
  ...rest: K
): ComposeFunction<T, K> {
  return ((x: any) => rest.reduce((x, f) => f(x), f(x))) as any;
}
