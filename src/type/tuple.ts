export type TrimTuple<T extends unknown[]> = T extends []
  ? []
  : T extends [x?: infer Head, ..._: infer Rest]
  ? [x?: Head, ..._: Rest] extends T
    ? []
    : [Head, ...TrimTuple<Rest>]
  : never;
