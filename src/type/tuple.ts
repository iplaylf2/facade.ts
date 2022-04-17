export type NotTuple<T extends unknown[]> = number extends T["length"]
  ? true
  : false;

export type Repeat<T extends unknown, N extends number, R extends T[] = []> = [
  R["length"]
] extends [N]
  ? R
  : Repeat<T, N, [...R, T]>;
