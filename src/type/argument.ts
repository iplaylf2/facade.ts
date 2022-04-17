import { NotTuple } from "./tuple";
import { IsAny, NonUndefinedAble } from "./value";

export type IsVariableParams<T extends unknown[]> = NotTuple<T> extends true
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

export type EnablePlaceholder<Params extends unknown[]> =
  Params extends []
    ? Params
    : Params extends [infer Head, ...infer Rest]
    ? [_?: Head | Placeholder, ..._: EnablePlaceholder<Rest>]
    : never;

export type TryApplyWithPlaceholder<
  Params extends unknown[],
  Args extends unknown[]
> = [Params, Args] extends [Params, []]
  ? [Params]
  : [Params, Args] extends [
      [infer Head1, ...infer Params],
      [infer Head2, ...infer Args]
    ]
  ? IsAny<Head2> extends true
    ? TryApplyWithPlaceholder<Params, Args>
    : [Head2] extends [Placeholder]
    ? TryApplyWithPlaceholder<Params, Args> extends [infer Rest]
      ? Rest extends unknown[]
        ? [[Head1, ...Rest]]
        : []
      : []
    : [Head2] extends [Head1]
    ? TryApplyWithPlaceholder<Params, Args>
    : []
  : [];

export type FixParameter<
  T extends unknown[],
  Length extends number,
  R extends unknown[] = []
> = [R["length"]] extends [Length]
  ? R
  : T extends []
  ? never
  : T extends [_?: infer X, ..._: infer Rest]
  ? [_?: X, ..._: Rest] extends T
    ? FixParameter<Rest, Length, [...R, NonUndefinedAble<X>]>
    : FixParameter<Rest, Length, [...R, X]>
  : never;
