import { LinkTuple } from "./tuple";

export type HaveOptionalParameter<T extends unknown[]> = T extends [
  ..._: infer Front,
  _?: infer Tail
]
  ? [..._: Front, _?: Tail] extends T
    ? T
    : never
  : never;

export const placeholder = Symbol("placeholder");

export interface Placeholder {
  [placeholder]: unknown;
}

export type PartialAndEnablePlaceholder<Parameter extends unknown> =
  Parameter extends []
    ? []
    : Parameter extends [infer Head, ...infer Rest]
    ? [_?: Head | Placeholder, ..._: PartialAndEnablePlaceholder<Rest>]
    : never;

export type ApplyWithPlaceholder<
  Params extends unknown[],
  Args extends unknown[]
> = [Params, Args] extends [Params, []]
  ? Params
  : [Params, Args] extends [
      [infer Head1, ...infer Params],
      [infer Head2, ...infer Args]
    ]
  ? Head2 extends Head1
    ? ApplyWithPlaceholder<Params, Args>
    : Head2 extends Placeholder
    ? LinkTuple<Head1, ApplyWithPlaceholder<Params, Args>>
    : never
  : never;

export type FixParameter<
  T extends unknown[],
  Length,
  R extends unknown[] = []
> = Length extends R["length"]
  ? R
  : T extends []
  ? never
  : T extends [_?: infer X, ..._: infer Rest]
  ? FixParameter<Rest, Length, [...R, NonNullable<X>]>
  : never;
