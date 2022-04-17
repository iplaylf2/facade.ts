import { BaseFunction, CanCurryingExtend, Currying } from "../function";

export type FunctionCompose<
  A extends BaseFunction,
  Rest extends BaseFunction[]
> = Rest extends []
  ? A
  : Rest extends [infer B, ...infer Rest]
  ? B extends BaseFunction
    ? Rest extends BaseFunction[]
      ? [TryMapFunctionSplit<A>, TryMapFunctionSplit<B>] extends [
          [infer From, infer Out],
          [infer In, infer To]
        ]
        ? CanMapFunctionApply<Out, In> extends true
          ? FunctionCompose<MapFunction<From, To>, Rest>
          : never
        : never
      : never
    : never
  : never;

type MapFunction<Param extends any = any, Return extends any = any> = (
  x: Param
) => Return;

type TryMapFunctionSplit<T extends BaseFunction> = T extends Currying<infer T>
  ? Parameters<T>["length"] extends 0
    ? []
    : T extends BaseFunction<[infer In, ...infer Rest], infer Return>
    ? [In] extends [never]
      ? []
      : Rest extends []
      ? [In, Return]
      : [In, Currying<BaseFunction<Rest, Return>>]
    : []
  : Parameters<T>["length"] extends 0
  ? []
  : T extends MapFunction<infer In, infer Out>
  ? [In] extends [never]
    ? []
    : [In, Out]
  : [];

type CanMapFunctionApply<T extends unknown, K extends unknown> = [T] extends [
  never
]
  ? false
  : [K] extends [never]
  ? false
  : [T] extends [K]
  ? true
  : T extends BaseFunction
  ? K extends BaseFunction
    ? CanCurryingExtend<T, K>
    : false
  : false;
