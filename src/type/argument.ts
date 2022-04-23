import { IsFixedTuple } from "./tuple";
import { IsAny, NonUndefinedAble } from "./value";

export type IsVariableParams<T extends unknown[]> =
  IsFixedTuple<T> extends false
    ? true
    : T extends [..._: infer Front, _?: infer Tail]
    ? [..._: Front, _?: Tail] extends T
      ? true
      : false
    : false;

export const placeholder = Symbol("placeholder");

export interface Placeholder {
  [placeholder]: unknown;
}

export type ParamsLoose<Params extends unknown[]> = Params extends []
  ? Params
  : Params extends [infer Head, ...infer Rest]
  ? [_?: Head | Placeholder, ..._: ParamsLoose<Rest>]
  : never;

export type TryPlaceholderApply<
  Params extends unknown[],
  Args extends unknown[]
> = [Params, Args] extends [Params, []]
  ? [Params]
  : [Params, Args] extends [
      [infer Head1, ...infer Params],
      [infer Head2, ...infer Args]
    ]
  ? IsAny<Head2> extends true
    ? TryPlaceholderApply<Params, Args>
    : [Head2] extends [Placeholder]
    ? TryPlaceholderApply<Params, Args> extends [infer Rest]
      ? Rest extends unknown[]
        ? [[Head1, ...Rest]]
        : []
      : []
    : [Head2] extends [Head1]
    ? TryPlaceholderApply<Params, Args>
    : []
  : [];

export type ParamsFix<
  T extends unknown[],
  Length extends number,
  R extends unknown[] = []
> = [R["length"]] extends [Length]
  ? R
  : T extends []
  ? never
  : T extends [_?: infer X, ..._: infer Rest]
  ? [_?: X, ..._: Rest] extends T
    ? ParamsFix<Rest, Length, [...R, NonUndefinedAble<X>]>
    : ParamsFix<Rest, Length, [...R, X]>
  : never;
