export type IsFixedTuple<T extends unknown[]> = number extends T["length"]
  ? false
  : true;

export type IsOptionalTuple<T extends unknown[]> = T extends [
  ..._: infer Front,
  _?: infer Tail
]
  ? [..._: Front, _?: Tail] extends T
    ? true
    : false
  : false;

export type Repeat<
  T extends unknown,
  N extends number,
  R extends T[] = []
> = R["length"] extends N ? R : Repeat<T, N, [...R, T]>;
