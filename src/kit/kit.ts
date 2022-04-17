import { BaseFunction, Currying, FunctionSpread } from "../type/function";
import { FunctionFlip } from "../type/kit/function-flip";
import { FunctionCompose } from "../type/kit/function-compose";
import { FunctionMargin } from "../type/kit/function-margin";
import { letCurrying, $ } from "../core/$";

export function flip<T extends BaseFunction>(
  f: T
): Currying<FunctionSpread<FunctionFlip<T>>> {
  const g = $(f);
  return letCurrying(function (this: unknown, a: unknown, b: unknown) {
    return (g as any).call(this, b, a);
  }, 2);
}

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
