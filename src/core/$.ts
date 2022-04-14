import { Currying, BaseFunction, FunctionSpread } from "../type/function";
import { FixParameter, placeholder, Placeholder } from "../type/argument";

export const $: {
  <T extends BaseFunction>(f: T): Currying<FunctionSpread<T>>;
  <T extends BaseFunction, K extends number>(
    f: T,
    length: K
  ): K extends Parameters<T>["length"]
    ? T extends BaseFunction<infer Params, infer Return>
      ? Currying<FunctionSpread<(...args: FixParameter<Params, K>) => Return>>
      : never
    : never;
} & Placeholder = Object.assign(
  (f: BaseFunction, length = f.length) => {
    if (currying_function in f) {
      return f;
    } else {
      return letCurrying(f, length);
    }
  },
  {
    [placeholder]: true,
  }
);

export const letCurrying = function (f: BaseFunction, length: number): any {
  const anchor = function (this: unknown, ...args: unknown[]): any {
    if (0 !== length && 0 === args.length) {
      return anchor;
    } else {
      return run_currying.call(this, f, length, args);
    }
  };

  return tag_currying(anchor);
};

const currying_function = Symbol("curring-function");

const isPlaceholder = function (x: unknown): x is Placeholder {
  return (
    undefined !== x && null !== x && Object.hasOwn(x as object, placeholder)
  );
};

const run_currying = function (
  this: unknown,
  f: BaseFunction,
  length: number,
  args: unknown[]
): any {
  const preload: unknown[] = [];
  const redirect: number[] = [];

  for (let i = 0; length !== i && args.length !== i; i++) {
    const current = args[i];
    if (isPlaceholder(current)) {
      redirect.push(i);
      preload.push(undefined);
    } else {
      preload.push(current);
    }
  }

  if (0 === redirect.length) {
    if (length === preload.length) {
      const result = f.apply(this, preload);
      const restArgs = args.slice(length);
      return apply_rest_argument.call(this, result, restArgs);
    } else {
      return letCurrying(function (this: unknown, ...args) {
        return f.call(this, ...preload, ...args);
      }, length - preload.length);
    }
  } else {
    const restArgs = args.slice(preload.length);

    return letCurrying(function (this: unknown, ...args) {
      const copy = preload.slice();
      for (let i = 0; redirect.length !== i; i++) {
        copy[redirect[i]!] = args[i];
      }

      const result = f.call(this, ...copy, ...args.slice(redirect.length));
      return apply_rest_argument.call(this, result, restArgs);
    }, length - preload.length + redirect.length);
  }
};

const apply_rest_argument = function (
  this: unknown,
  result: unknown,
  restArgs: unknown[]
): any {
  if (result instanceof Function) {
    if (currying_function in result) {
      return result.apply(this, restArgs);
    } else {
      return run_currying.call(
        this,
        result as BaseFunction,
        result.length,
        restArgs
      );
    }
  } else {
    if (0 === restArgs.length) {
      return result;
    } else {
      throw restArgs;
    }
  }
};

const tag_currying = function (f: BaseFunction) {
  return Object.assign(f, {
    [currying_function]: true,
  });
};
