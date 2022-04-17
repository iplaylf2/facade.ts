import { TryPlaceholderApply, IsVariableParams, ParamsLoose } from "./argument";
import { IsAny } from "./value";

export type BaseFunction<Params extends unknown[] = any, Return = any> = (
  ...args: Params
) => Return;

export type DeCurrying<T extends BaseFunction> = T extends Currying<infer T>
  ? T
  : T;

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

export type CanCurryingExtend<
  T extends BaseFunction,
  K extends BaseFunction
> = T extends K
  ? true
  : K extends Currying<infer K>
  ? [K] extends [never]
    ? false
    : Parameters<K>["length"] extends 0 | 1
    ? T extends K
      ? true
      : false
    : false
  : T extends Currying<infer T>
  ? [T] extends [never]
    ? false
    : T extends K
    ? true
    : false
  : false;

type TryFunctionSpread<T extends BaseFunction> =
  DeCurrying<T> extends BaseFunction<infer Params, infer Return>
    ? IsVariableParams<Params> extends false
      ? [Return] extends [never]
        ? [BaseFunction<Params, Return>]
        : IsAny<Return> extends true
        ? [BaseFunction<Params, Return>]
        : [Return] extends [BaseFunction]
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
