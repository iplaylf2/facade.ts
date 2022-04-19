# facade.ts

一个为 TypeScript 提供函数式风格编程的类库。

[English](https://github.com/Iplaylf2/facade.ts/blob/main/README.md) | 中文

## 安装

```bash
npm install facade.ts
```

## 用例

```typescript
import { $, $call, compose } from "facade.ts";

const length_of = (x: string) => x.length;

// create a currying function
const greater_than_or_equal = $((a: number, b: number) => a >= b);

// apply partial argument to create a new function
const less_than_5 = greater_than_or_equal(5);

// compose some functions into a new function
const length_less_than_5 = compose(length_of, less_than_5);

// create a currying function for call form, it accept 1 other parameter
const filter = $call(Array.prototype.filter, 1);

// disregard some parameters for now
const filter_by_length = filter($, length_less_than_5);

const filter_by_prop_name = compose(
  Object.getOwnPropertyNames,
  filter_by_length
);

// same as
// const filter_by_prop_name = function (x: object) {
//   return Object.getOwnPropertyNames(x).filter((x) => 5 >= x.length);
// };

console.log(filter_by_prop_name(Array.prototype));
// ['fill', 'find', 'pop', 'push', 'sort', 'join', 'keys', 'flat', 'map', 'some', 'at']
```

## 类型安全

```typescript
const hello = $(
  (name: string, vol: number) => `Hello, ${name}${"!".repeat(vol)}`
);

// console.log(hello("foo")("4"));
// Argument of type '"4"' is not assignable to parameter of type 'number | Placeholder | undefined'.ts(2345)

// hello("foo")(undefined).length
// Property 'length' does not exist on type 'never'.ts(2339)

console.log(hello("foo")(4));
// Hello, foo!!!!

console.log(hello("bar", 1));
// Hello, bar!
```

## api

### $

创建一个柯里化函数

```typescript
$((a: string) => (b: number) => a.repeat(b)); // Currying<(a: string, b: number) => string>
$((a: string, b: number) => a.repeat(b)); // Currying<(a: string, b: number) => string>
$((a: string, b: number = 1) => a.repeat(b)); // Currying<never>
// the length of parameter should be fixed
$((a: string, b: number = 1) => a.repeat(b), 1); // Currying<(args_0: string) => string>
// add length to the length of parameter
$((a: string, b: number = 1) => a.repeat(b), 2); // Currying<(args_0: string, args_1: number) => string>
```

### $class

将一个构造器创建为柯里化函数

```typescript
const promise = $class(Promise);
```

### $call

将 js 的调用形式创建为柯里化函数

```typescript
const reduce = $call(Array.prototype.reduce, 2);
```

### flip

调换函数的前两个参数的顺序

```typescript
flip((a: string, b: number) => a.repeat(b));
// same as (b: number , a: string) => a.repeat(b)
```

### compose

将函数从左到右结合起来

```typescript
compose(
  (a: string) => a.length,
  (b: number) => b % 2 === 0,
  (c: boolean) => c.toString()
);
// (x :string) => string
```

### margin

将一个值包装成接受 n 个参数的函数

```typescript
margin("foo"); // ()=> string
margin("foo", 2); // (args_0 : any, args_1: any) => string
```

### thrush

接受任意个值，并将他们应用于未来的函数中

```typescript
thrush("foo", 3)((a, b) => a.repeat(b)); // foofoofoo
```
