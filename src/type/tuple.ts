export type LinkTuple<T extends unknown, K extends unknown[]> = K extends never
  ? never
  : [T, ...K];

export type Repeat<T extends unknown, N extends number, R extends T[] = []> = [
  R["length"]
] extends [N]
  ? R
  : Repeat<T, N, [...R, T]>;
