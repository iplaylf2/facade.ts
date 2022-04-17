import {
  TryApplyWithPlaceholder,
  IsVariableParams,
  EnablePlaceholder,
} from "./argument";

export type BaseFunction<Params extends unknown[] = any, Return = any> = (
  ...args: Params
) => Return;

export type FunctionSpread<T extends BaseFunction> =
  TryFunctionSpread<T> extends [BaseFunction<infer Params, infer Return>]
    ? (...args: Params) => Return
    : never;

export type Currying<T extends BaseFunction> = {
  <Args extends EnablePlaceholder<Parameters<T>>>(...args: Args): CurryingApply<
    T,
    Args
  >;
  de: T;
};

export type ComposeFunction<
  A extends BaseFunction,
  Rest extends BaseFunction[]
> = Rest extends []
  ? A
  : Rest extends [infer B, ...infer Rest]
  ? B extends BaseFunction
    ? Rest extends BaseFunction[]
      ? [TrySplitMapFunction<A>, TrySplitMapFunction<B>] extends [
          [true, infer From, infer Out],
          [true, infer In, infer To]
        ]
        ? CanApplyMapFunction<Out, In> extends true
          ? ComposeFunction<(x: From) => To, Rest>
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
> = TryApplyWithPlaceholder<Parameters<T>, Args> extends [[...infer Params]]
  ? Params extends []
    ? ReturnType<T>
    : Currying<(...args: Params) => ReturnType<T>>
  : never;

type MapFunction<Param extends any = any, Return extends any = any> = (
  x: Param
) => Return;

type TrySplitMapFunction<T extends BaseFunction> = T extends Currying<infer T>
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

type CanApplyMapFunction<T extends unknown, K extends unknown> = [T] extends [K]
  ? true
  : false;
