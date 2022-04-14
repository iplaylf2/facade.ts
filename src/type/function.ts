import {
  ApplyWithPlaceholder,
  HaveOptionalParameter,
  PartialAndEnablePlaceholder,
} from "./argument";

export type GeneralFunction<Params extends any[] = any, Return = any> = (
  ...args: Params
) => Return;

export type Currying<T extends GeneralFunction> = <
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

type RawFunction<T extends GeneralFunction> = T extends Currying<infer T> ? T : T;

type LinkFunction<
  Params extends unknown[],
  T extends GeneralFunction
> = T extends never
  ? T
  : T extends GeneralFunction<infer Rest, infer Return>
  ? GeneralFunction<[...Params, ...Rest], Return>
  : never;

type FunctionSpread<T extends GeneralFunction> =
  RawFunction<T> extends GeneralFunction<infer Params, infer Return>
    ? HaveOptionalParameter<Params> extends true
      ? never
      : Return extends never
      ? T
      : Return extends GeneralFunction
      ? LinkFunction<Params, FunctionSpread<Return>>
      : T
    : never;
