import { ClassType } from "./type/class";
import { HaveOptionalParameter, FixParameter } from "./type/argument";
import { Currying } from "./type/function";
import { $ } from "./$";

export function $class<T extends ClassType>(
  ctor: T
): T extends new (...args: infer Params) => infer Instance
  ? HaveOptionalParameter<Params> extends false
    ? Currying<(...args: Params) => Instance>
    : never
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
  return $(
    new Proxy((...args: unknown[]) => new ctor(...args), {
      get(ctor, p) {
        if ("length" === p) {
          return length;
        } else {
          return (ctor as any)[p];
        }
      },
    })
  );
}
