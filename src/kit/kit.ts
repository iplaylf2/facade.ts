import { BaseFunction, Currying, FunctionSpread } from "../type/function";
import { FunctionCompose } from "../type/kit/function-compose";
import { FunctionMargin } from "../type/kit/function-margin";
import { letCurrying } from "../core/$";

export function compose<T extends BaseFunction, K extends BaseFunction[]>(
  f: T,
  ...rest: K
): Currying<FunctionSpread<FunctionCompose<T, K>>> {
  return letCurrying((x: any) => rest.reduce((x, f) => f(x), f(x)), 1) as any;
}

export function margin<T extends BaseFunction, K extends number>(
  f: T,
  length: K
): Currying<FunctionSpread<FunctionMargin<T, K>>> {
  return letCurrying(() => f, length);
}
