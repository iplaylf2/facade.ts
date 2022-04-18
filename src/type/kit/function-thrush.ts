import { BaseFunction, Currying, CurryingApply } from "../function";

export type FunctionThrush<T extends unknown[]> = <K extends BaseFunction>(
  f: K
) => K extends Currying<infer K>
  ? CurryingApply<K, T>
  : T extends Parameters<K>
  ? ReturnType<K>
  : never;
