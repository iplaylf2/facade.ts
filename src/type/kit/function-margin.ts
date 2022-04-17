import { BaseFunction } from "../function";
import { Repeat } from "../tuple";

export type FunctionMargin<
  T extends BaseFunction,
  K extends number
> = BaseFunction<Repeat<any, K>, T>;
