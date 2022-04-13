import { $ } from "facade.ts";

const foo = $(() => () => 100);

console.log(foo());
