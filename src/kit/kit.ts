import {
  FunctionCompose,
  BaseFunction,
  Currying,
  FunctionSpread,
} from "../type/function";
import { Repeat } from "../type/tuple";
import { letCurrying } from "../core/$";

export function compose<T extends BaseFunction, K extends BaseFunction[]>(
  f: T,
  ...rest: K
): Currying<FunctionCompose<T, K>> {
  return letCurrying((x: any) => rest.reduce((x, f) => f(x), f(x)), 1) as any;
}

export function margin<T extends BaseFunction, K extends number>(
  f: T,
  length: K
): Currying<FunctionSpread<BaseFunction<Repeat<any, K>, T>>> {
  return letCurrying(() => f, length);
}
