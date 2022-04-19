import { Repeat } from "../tuple";

export type FunctionMargin<T, K extends number> = (
  ...args: Repeat<any, K>
) => T;
