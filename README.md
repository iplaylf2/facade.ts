# facade.ts

A functional style library for TypeScript.

English | [中文](https://github.com/Iplaylf2/facade.ts/blob/main/doc/README.cn.md)

## install

```bash
npm install facade.ts
```

## usage

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

## type safe

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

create a currying function

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

create a currying function for constructor

```typescript
const promise = $class(Promise);
```

### $call

create a currying function for call form

```typescript
const reduce = $call(Array.prototype.reduce, 2);
```

### flip

reverse first two arguments' order

```typescript
flip((a: string, b: number) => a.repeat(b));
// same as (b: number , a: string) => a.repeat(b)
```

### compose

perform left-to-right function composition

```typescript
compose(
  (a: string) => a.length,
  (b: number) => b % 2 === 0,
  (c: boolean) => c.toString()
);
// (x :string) => string
```

### margin

wrap a value into a function with any number of parameters

```typescript
margin("foo"); // ()=> string
margin("foo", 2); // (args_0 : any, args_1: any) => string
```

### thrush

take some values and apply a function to them

```typescript
thrush("foo", 3)((a, b) => a.repeat(b)); // foofoofoo
```
