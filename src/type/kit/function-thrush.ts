import { BaseFunction, Currying, CurryingApply } from "../function";

export type FunctionThrush<T extends unknown[]> = <
  K extends BaseFunction<T, any>
>(
  f: K
) => K extends Currying<infer K> ? CurryingApply<K, T> : ReturnType<K>;
