import { Currying, GeneralFunction } from "./type/function";
import { FixParameter, placeholder, Placeholder } from "./type/argument";

export const $: {
  <T extends GeneralFunction>(f: T): Currying<T>;
  <T extends GeneralFunction, K extends Exclude<Parameters<T>["length"], 0>>(
    f: T,
    length: K
  ): T extends (...args: infer Params) => infer Return
    ? Currying<(...args: FixParameter<Params, K>) => Return>
    : never;
} & Placeholder = Object.assign(
  (f: GeneralFunction, length = f.length) => {
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

export const letCurrying = function (f: GeneralFunction, length: number): any {
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
  f: GeneralFunction,
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
        result as GeneralFunction,
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

const tag_currying = function (f: GeneralFunction) {
  return Object.assign(f, {
    [currying_function]: true,
  });
};
