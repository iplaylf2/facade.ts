export type TrimTuple<T extends unknown[]> = T extends []
  ? []
  : T extends [..._: infer Front, x?: infer Tail]
  ? [..._: Front, x?: Tail] extends T
    ? TrimTuple<Front>
    : [...Front, Tail]
  : never;
