import { $, $class, flip, margin } from "facade.ts";

const delay = (ms: number): Promise<void> => {
  const delay_cb = flip(margin($(setTimeout, 2)($, ms), 1));
  return $class(Promise)(delay_cb) as any;
};

const delayX = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

console.log(performance.now());
delay(1000)
  .then(() => console.log("zzz"))
  .then(() => console.log(performance.now()));
