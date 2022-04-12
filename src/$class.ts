import { ClassType } from "./type/class";
import { HaveOptionalParameter, FixParameter } from "./type/argument";
import { Currying } from "./type/function";

export function $class<T extends ClassType>(
  f: T
): T extends new (...args: infer Params) => infer Instance
  ? never extends HaveOptionalParameter<Params>
    ? Currying<(...args: Params) => Instance>
    : never
  : never;
export function $class<
  T extends ClassType,
  K extends ConstructorParameters<T>["length"]
>(
  f: T,
  length: K
): T extends new (...args: infer Params) => infer Instance
  ? Currying<(...args: FixParameter<Params, K>) => Instance>
  : never;
export function $class(f: ClassType, length?: number): any {}

