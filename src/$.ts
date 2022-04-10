import { Currying, FunctionType } from "./type/function";
import { placeholder, Placeholder } from "./type/argument";
import { Argument } from "./component/argument";

const currying_function = Symbol("curring-function");

const currying = function <T extends FunctionType>(f: T): Currying<T> {
  if (currying_function in f) {
    return f;
  }

  const handler = function (this: unknown, ...args: unknown[]): any {};

  return Object.assign(handler, { [currying_function]: true });
};

export const $ = Object.assign(currying, {
  [placeholder]: true,
} as Placeholder);
