import { ClassFunction } from "../type/class";
import { ParamsFix, IsVariableParams } from "../type/argument";
import { Currying } from "../type/function";
import { letCurrying } from "./$";

export function $class<T extends ClassFunction>(
  ctor: T
): T extends ClassFunction<infer Params, infer Instance>
  ? IsVariableParams<Params> extends false
    ? Currying<(...args: Params) => Instance>
    : never
  : never;
export function $class<T extends ClassFunction, K extends number>(
  ctor: T,
  length: K
): T extends ClassFunction<infer Params, infer Instance>
  ? K extends Params["length"]
    ? Currying<(...args: ParamsFix<Params, K>) => Instance>
    : never
  : never;
export function $class(ctor: ClassFunction, length = ctor.length): any {
  return letCurrying((...args: unknown[]) => new ctor(...args), length);
}
