import { ParamsFix } from "../type/argument";
import { BaseFunction, Currying, FunctionSpread } from "../type/function";
import { letCurrying } from "./$";

export function $call<T extends BaseFunction>(
  f: T
): T extends (this: infer This, ...args: infer Params) => infer Return
  ? Currying<FunctionSpread<BaseFunction<[This, ...Params], Return>>>
  : never;
export function $call<T extends BaseFunction, K extends number>(
  f: T,
  length: K
): T extends (this: infer This, ...args: infer Params) => infer Return
  ? K extends Params["length"]
    ? Currying<
        FunctionSpread<BaseFunction<[This, ...ParamsFix<Params, K>], Return>>
      >
    : never
  : never;
export function $call(f: BaseFunction, length = f.length): any {
  return letCurrying(
    (...args: unknown[]) => f.apply(args[0], args.slice(1)),
    length + 1
  );
}
