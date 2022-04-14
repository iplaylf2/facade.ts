import {
  ComposeFunction,
  BaseFunction,
  Currying,
  FunctionSpread,
} from "../type/function";
import { Repeat } from "../type/tuple";
import { letCurrying } from "./$";

export function compose<T extends BaseFunction, K extends BaseFunction[]>(
  f: T,
  ...rest: K
): ComposeFunction<T, K> {
  return ((x: any) => rest.reduce((x, f) => f(x), f(x))) as any;
}

export function margin<T extends BaseFunction, K extends number>(
  f: T,
  length: K
): Currying<FunctionSpread<(...args: Repeat<any, K>) => T>> {
  return letCurrying(() => f, length);
}
