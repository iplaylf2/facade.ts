import { TryPlaceholderApply, IsVariableParams, ParamsLoose } from "./argument";

export type BaseFunction<Params extends unknown[] = any, Return = any> = (
  ...args: Params
) => Return;

export type FunctionSpread<T extends BaseFunction> =
  TryFunctionSpread<T> extends [BaseFunction<infer Params, infer Return>]
    ? (...args: Params) => Return
    : never;

export type Currying<T extends BaseFunction> = {
  <Args extends ParamsLoose<Parameters<T>>>(...args: Args): CurryingApply<
    T,
    Args
  >;
  de: T;
};

export type FunctionCompose<
  A extends BaseFunction,
  Rest extends BaseFunction[]
> = Rest extends []
  ? A
  : Rest extends [infer B, ...infer Rest]
  ? B extends BaseFunction
    ? Rest extends BaseFunction[]
      ? [TryMapFunctionSplit<A>, TryMapFunctionSplit<B>] extends [
          [true, infer From, infer Out],
          [true, infer In, infer To]
        ]
        ? CanMapFunctionApply<Out, In> extends true
          ? FunctionCompose<(x: From) => To, Rest>
          : never
        : never
      : never
    : never
  : never;

type DeCurrying<T extends BaseFunction> = T extends Currying<infer T> ? T : T;

type TryFunctionSpread<T extends BaseFunction> =
  DeCurrying<T> extends BaseFunction<infer Params, infer Return>
    ? IsVariableParams<Params> extends false
      ? Return extends never
        ? [BaseFunction<Params, Return>]
        : Return extends BaseFunction
        ? TryFunctionSpread<Return> extends [
            BaseFunction<infer Rest, infer Return>
          ]
          ? [BaseFunction<[...Params, ...Rest], Return>]
          : []
        : [BaseFunction<Params, Return>]
      : []
    : [];

type CurryingApply<
  T extends BaseFunction,
  Args extends unknown[]
> = TryPlaceholderApply<Parameters<T>, Args> extends [[...infer Params]]
  ? Params extends []
    ? ReturnType<T>
    : Currying<(...args: Params) => ReturnType<T>>
  : never;

type MapFunction<Param extends any = any, Return extends any = any> = (
  x: Param
) => Return;

type TryMapFunctionSplit<T extends BaseFunction> = T extends Currying<infer T>
  ? T extends BaseFunction<[infer In, ...infer Rest], infer Return>
    ? In extends never
      ? []
      : [In, Currying<BaseFunction<Rest, Return>>]
    : []
  : T extends MapFunction<infer In, infer Out>
  ? In extends never
    ? []
    : [In, Out]
  : [];

type CanMapFunctionApply<T extends unknown, K extends unknown> = [T] extends [K]
  ? true
  : false;
