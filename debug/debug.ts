import { $ } from "facade.ts";

const foo = $((a:1,b:2,c:3) => (d:4,e:5,f:6) => 100);

console.log(foo(1,2,3,4));
