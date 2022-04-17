import { BaseFunction, DeCurrying } from "../function";

export type FunctionFlip<T extends BaseFunction> =
  DeCurrying<T> extends BaseFunction<infer Params, infer Return>
    ? Params["length"] extends 0 | 1
      ? never
      : Params extends [infer A, infer B, ...infer Rest]
      ? BaseFunction<[B, A, ...Rest], Return>
      : never
    : never;
