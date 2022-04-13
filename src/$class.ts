import { ClassType } from "./type/class";
import { FixParameter } from "./type/argument";
import { Currying } from "./type/function";
import { letCurrying } from "./$";

export function $class<T extends ClassType>(
  ctor: T
): T extends new (...args: infer Params) => infer Instance
  ? Currying<(...args: Params) => Instance>
  : never;
export function $class<
  T extends ClassType,
  K extends Exclude<ConstructorParameters<T>["length"], 0>
>(
  ctor: T,
  length: K
): T extends new (...args: infer Params) => infer Instance
  ? Currying<(...args: FixParameter<Params, K>) => Instance>
  : never;
export function $class(ctor: ClassType, length = ctor.length): any {
  return letCurrying((...args: unknown[]) => new ctor(...args), length);
}
