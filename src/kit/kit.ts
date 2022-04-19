import { BaseFunction } from "../type/function";
import { FunctionFlip } from "../type/kit/function-flip";
import { FunctionCompose } from "../type/kit/function-compose";
import { FunctionMargin } from "../type/kit/function-margin";
import { FunctionThrush } from "../type/kit/function-thrush";
import { isCurrying, letCurrying } from "../core/$";

export function flip<T extends BaseFunction>(f: T): FunctionFlip<T> {
  if (isCurrying(f)) {
    return letCurrying(function (this: unknown, a: unknown, b: unknown) {
      return f.call(this, b, a);
    }, 2);
  } else {
    return new Proxy(f, flip_handler) as any;
  }
}

export function compose<T extends BaseFunction, K extends BaseFunction[]>(
  f: T,
  ...rest: K
): FunctionCompose<T, K> {
  return ((x: any) => rest.reduce((x, f) => f(x), f(x))) as any;
}

export function margin<T, K extends number = 0>(
  x: T,
  length: K = 0 as K
): FunctionMargin<T, K> {
  return new Proxy(() => x, {
    get(target, p) {
      if ("length" === p) {
        return length;
      } else {
        return (target as any)[p];
      }
    },
  });
}

export function thrush<T extends unknown[]>(...args: T): FunctionThrush<T> {
  return function (this: unknown, f: BaseFunction) {
    return f.apply(this, args);
  };
}

const flip_handler: ProxyHandler<BaseFunction> = {
  apply(target, thisArg, argsArray) {
    return target.call(
      thisArg,
      argsArray[1],
      argsArray[0],
      ...argsArray.slice(2)
    );
  },
};
