import {
  ApplyWithPlaceholder,
  HaveOptionalParameter,
  PartialAndEnablePlaceholder,
} from "./argument";

export type BaseFunction<Params extends unknown[] = any, Return = any> = (
  ...args: Params
) => Return;

export type FunctionSpread<T extends BaseFunction> =
  DeCurrying<T> extends BaseFunction<infer Params, infer Return>
    ? HaveOptionalParameter<Params> extends false
      ? Return extends never
        ? (...args: Params) => Return
        : Return extends BaseFunction
        ? LinkFunction<Params, FunctionSpread<Return>>
        : (...args: Params) => Return
      : never
    : never;

export type Currying<T extends BaseFunction> = <
  Args extends PartialAndEnablePlaceholder<Parameters<T>>
>(
  ...args: Args
) => CurryingApply<T, Args>;

export type ComposeFunction<
  A extends BaseFunction,
  Rest extends BaseFunction[]
> = Rest extends []
  ? A
  : Rest extends [infer B, ...infer Rest]
  ? B extends BaseFunction
    ? [DeCurrying<A>, DeCurrying<B>] extends [
        MapFunction<infer From, infer Out>,
        MapFunction<infer In, infer To>
      ]
      ? [Out] extends [In]
        ? Rest extends BaseFunction[]
          ? ComposeFunction<(x: From) => To, Rest>
          : never
        : never
      : never
    : never
  : never;

type DeCurrying<T extends BaseFunction> = T extends Currying<infer T> ? T : T;

type LinkFunction<
  Params extends unknown[],
  T extends BaseFunction
> = T extends never
  ? never
  : T extends BaseFunction<infer Rest, infer Return>
  ? (...args: [...Params, ...Rest]) => Return
  : never;

type CurryingApply<
  T extends BaseFunction,
  Args extends unknown[]
> = ApplyWithPlaceholder<Parameters<T>, Args> extends infer Params
  ? Params extends never
    ? never
    : Params extends []
    ? ReturnType<T>
    : Params extends [...infer Params]
    ? Currying<(...args: Params) => ReturnType<T>>
    : never
  : never;

type MapFunction<Param extends any = any, Return extends any = any> = (
  x: Param
) => Return;
