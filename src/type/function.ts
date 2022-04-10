import {
  ApplyWithPlaceholder,
  HaveOptionalParameter,
  PartialAndEnablePlaceholder,
} from "./argument";

export type FunctionType = (...args: any[]) => any;

type RawFunction<T extends FunctionType> = T extends Currying<infer T> ? T : T;

type LinkFunction<
  Params extends unknown[],
  T extends FunctionType
> = T extends never
  ? T
  : T extends (...args: infer Rest) => infer Return
  ? (...args: [...Params, ...Rest]) => Return
  : never;

type FunctionSpread<T extends FunctionType> = RawFunction<T> extends (
  ...args: infer Params
) => infer Return
  ? Params extends HaveOptionalParameter<Params>
    ? never
    : Return extends never
    ? (...args: Params) => Return
    : Return extends FunctionType
    ? LinkFunction<Params, FunctionSpread<Return>>
    : (...args: Params) => Return
  : never;

export type Currying<T extends FunctionType> = <
  SpreadFunction extends FunctionSpread<T>,
  Params extends Parameters<SpreadFunction>,
  Return extends ReturnType<SpreadFunction>,
  Args extends PartialAndEnablePlaceholder<Params>
>(
  ...args: Args
) => ApplyWithPlaceholder<Params, Args> extends infer Params
  ? Params extends never
    ? Params
    : Params extends []
    ? Return
    : Params extends [...infer Params]
    ? Currying<(...args: Params) => Return>
    : never
  : never;
