export type ClassFunction<Params extends any[] = any, Instance = any> = new (
  ...args: Params
) => Instance;
