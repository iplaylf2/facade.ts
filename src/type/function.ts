import {
  ApplyWithPlaceholder,
  HaveOptionalParameter,
  PartialAndEnablePlaceholder,
} from "./argument";

export type BaseFunction<Params extends any[] = any, Return = any> = (
  ...args: Params
) => Return;

export type FunctionSpread<T extends BaseFunction> =
  RawFunction<T> extends BaseFunction<infer Params, infer Return>
    ? HaveOptionalParameter<Params> extends false
      ? Return extends never
        ? (...args: Params) => Return
        : Return extends BaseFunction
        ? LinkFunction<Params, FunctionSpread<Return>>
        : (...args: Params) => Return
      : never
    : never;

export type Currying<T extends BaseFunction> = <
  Params extends Parameters<T>,
  Return extends ReturnType<T>,
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

export type ComposeFunction<
  Begin extends BaseFunction,
  Rest extends BaseFunction[]
> = Rest extends []
  ? Begin
  : Rest extends [infer X, ...infer Rest]
  ? X extends BaseFunction
    ? [RawFunction<Begin>, RawFunction<X>] extends [
        BaseFunction<[infer From], infer Out>,
        BaseFunction<[infer In], infer To>
      ]
      ? Out extends In
        ? Rest extends BaseFunction[]
          ? ComposeFunction<(x: From) => To, Rest>
          : never
        : never
      : never
    : never
  : never;

type RawFunction<T extends BaseFunction> = T extends Currying<infer T> ? T : T;

type LinkFunction<
  Params extends unknown[],
  T extends BaseFunction
> = T extends never
  ? T
  : T extends BaseFunction<infer Rest, infer Return>
  ? (...args: [...Params, ...Rest]) => Return
  : never;
