import { TrimTuple } from "./tuple";
import { ApplyWithPlaceholder } from "./argument";

export type FunctionType = (...args: any[]) => any;

type RawFunction<T extends FunctionType> = T extends Currying<infer T> ? T : T;

type FunctionSpread<T extends FunctionType> = RawFunction<T> extends (
  ...args: infer Params
) => infer Return
  ? TrimTuple<Params> extends [...infer Params]
    ? Return extends FunctionType
      ? FunctionSpread<Return> extends (
          ...args: infer RestParams
        ) => infer FinalReturn
        ? (...args: [...Params, ...RestParams]) => FinalReturn
        : never
      : (...args: Params) => Return
    : never
  : never;

export type Currying<T extends FunctionType> = <Args extends unknown[]>(
  ...args: Args
) => FunctionSpread<T> extends (...args: infer Params) => infer Return
  ? ApplyWithPlaceholder<Args, Params> extends [...infer Params]
    ? Params extends []
      ? Return
      : Currying<(...args: Params) => Return>
    : never
  : never;
