type FunctionType = (...args: any[]) => any;

type TrimTuple<T extends unknown[]> = T extends []
  ? []
  : T extends [x?: infer Head, ..._: infer Rest]
  ? [x?: Head, ..._: Rest] extends T
    ? []
    : [Head, ...TrimTuple<Rest>]
  : never;

type FunctionSpread<T extends FunctionType> = T extends (
  ...args: infer Params
) => infer Return
  ? TrimTuple<Params> extends [...infer Params]
    ? Return extends FunctionType
      ? FunctionSpread<Return> extends (
          ...args: infer RestParams
        ) => infer FinalReturn
        ? (...args: [...Params, ...RestParams]) => FinalReturn
        : never
      : (...args: Params) => Return
    : never
  : never;

const placeholder = Symbol("placeholder");

interface Placeholder {
  [placeholder]: unknown;
}

type ApplyPlaceholder<Args extends unknown[], Params extends unknown[]> = [
  Args,
  Params
] extends [[], Params]
  ? Params
  : [Args, Params] extends [
      [infer Head1, ...infer Args],
      [infer Head2, ...infer Params]
    ]
  ? Head1 extends Head2
    ? ApplyPlaceholder<Args, Params>
    : Head1 extends Placeholder
    ? [Head2, ...ApplyPlaceholder<Args, Params>]
    : never
  : never;

type Currying<T extends FunctionType> = <Args extends unknown[]>(
  ...args: Args
) => FunctionSpread<T> extends (...args: infer Params) => infer Return
  ? ApplyPlaceholder<Args, Params> extends [...infer Params]
    ? Params extends []
      ? Return
      : Currying<(...args: Params) => Return>
    : never
  : never;

declare const $: Placeholder;
declare const fooFunc: Currying<(a: 1, b: 2) => (b: 3, c?: 4) => 5>;
