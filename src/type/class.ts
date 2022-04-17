export type ClassFunction<
  Params extends unknown[] = any,
  Instance = any
> = new (...args: Params) => Instance;
