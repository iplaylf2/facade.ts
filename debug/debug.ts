import { $, $class, margin } from "facade.ts";
import { Currying } from "facade.ts/type/function";

const delay = (ms: number): Promise<void> => {
  const delayCb = $(setTimeout, 2)($, ms);
  return $class(Promise)(flip(margin(delayCb, 1)));
};
