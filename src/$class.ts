import { ClassFunction } from "./type/class";
import { FixParameter } from "./type/argument";
import { Currying } from "./type/function";
import { letCurrying } from "./$";

export function $class<T extends ClassFunction>(
  ctor: T
): T extends ClassFunction<infer Params, infer Instance>
  ? Currying<(...args: Params) => Instance>
  : never;
export function $class<
  T extends ClassFunction,
  K extends Exclude<ConstructorParameters<T>["length"], 0>
>(
  ctor: T,
  length: K
): T extends ClassFunction<infer Params, infer Instance>
  ? Currying<(...args: FixParameter<Params, K>) => Instance>
  : never;
export function $class(ctor: ClassFunction, length = ctor.length): any {
  return letCurrying((...args: unknown[]) => new ctor(...args), length);
}
