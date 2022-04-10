export type LinkTuple<T extends unknown, K extends unknown[]> = K extends never
  ? K
  : [T, ...K];
