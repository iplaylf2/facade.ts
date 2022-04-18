import { BaseFunction } from "../function";
import { Repeat } from "../tuple";

export type FunctionMargin<T, K extends number> = BaseFunction<
  Repeat<any, K>,
  T
>;
