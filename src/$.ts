import { Currying, FunctionType } from "./type/function";
import { placeholder, Placeholder } from "./type/argument";
import { Argument } from "./component/argument";

const currying_function = Symbol("curring-function");

const currying = function <T extends FunctionType>(f: T): Currying<T> {
  if (currying_function in f) {
    return f;
  }

  const argument = new Argument();
  let current_f = f;

  const handler = function (this: unknown, ...args: unknown[]): any {
    argument.apply(args);
    const [enough, actual_args] = argument.tryTake(current_f.length);
    if (enough) {
      const result = current_f.apply(this, actual_args);
      if (result instanceof Function) {
        if (currying_function in result) {
          return result.apply(this, argument.takeAll());
        } else {
          current_f = result;
          return handler.apply(this);
        }
      } else {
        return result;
      }
    } else {
      return handler;
    }
  };

  return Object.assign(handler, { [currying_function]: true });
};

export const $ = Object.assign(currying, {
  [placeholder]: true,
} as Placeholder);
