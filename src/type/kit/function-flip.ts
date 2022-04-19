import { BaseFunction, Currying } from "../function";

export type FunctionFlip<T extends BaseFunction> = T extends Currying<infer T>
  ? Currying<FunctionFlipRaw<T>>
  : FunctionFlipRaw<T>;

type FunctionFlipRaw<T extends BaseFunction> = T extends BaseFunction<
  infer Params,
  infer Return
>
  ? Params["length"] extends 0 | 1
    ? never
    : Params extends [infer A, infer B, ...infer Rest]
    ? BaseFunction<[B, A, ...Rest], Return>
    : never
  : never;
