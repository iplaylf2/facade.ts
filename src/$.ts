import { Currying, FunctionType } from "./type/function";
import { placeholder, Placeholder } from "./type/argument";

const currying_function = Symbol("curring-function");

const isPlaceholder = function (x: unknown): x is Placeholder {
  return (
    undefined !== x && null !== x && Object.hasOwn(x as object, placeholder)
  );
};

const let_currying = function (f: FunctionType, length: number): any {
  const anchor = function (this: unknown, ...args: unknown[]): any {
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
        if (result instanceof Function) {
          const restArgs = args.slice(length);
          if (currying_function in result) {
            return result.apply(this, restArgs);
          } else {
            return let_currying(result, result.length).apply(this, restArgs);
          }
        } else {
          if (length === args.length) {
            return result;
          } else {
            throw args;
          }
        }
      } else {
        if (0 === args.length) {
          return anchor;
        } else {
          return let_currying(function (this: unknown, ...args) {
            return f.call(this, ...preload, ...args);
          }, length - preload.length);
        }
      }
    } else {
      const restArgs = args.slice(preload.length);

      return let_currying(function (this: unknown, ...args) {
        const copy = preload.slice();
        for (let i = 0; redirect.length !== i; i++) {
          copy[redirect[i]!] = args[i];
        }

        return f.call(
          this,
          ...copy,
          ...args.slice(redirect.length),
          ...restArgs
        );
      }, length - preload.length + redirect.length);
    }
  };

  return tag_currying(anchor);
};

const tag_currying = function (f: FunctionType) {
  return Object.assign(f, {
    [currying_function]: true,
  });
};

export const $ = Object.assign(
  <T extends FunctionType>(f: T): Currying<T> => {
    if (currying_function in f) {
      return f;
    } else {
      if (0 === f.length) {
        throw f;
      } else {
        return let_currying(f, f.length);
      }
    }
  },
  {
    [placeholder]: true,
  } as Placeholder
);
