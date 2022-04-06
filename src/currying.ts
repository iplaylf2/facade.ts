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
      ? FunctionSpread<Return> extends [
          [...infer RestParams],
          infer FinalReturn
        ]
        ? [[...Params, ...RestParams], FinalReturn]
        : never
      : [Params, Return]
    : never
  : never;

const placeholder = Symbol("placeholder");

interface Placeholder {
  [placeholder]: unknown;
}

type ApplyPlaceholder<Argus extends unknown[], Params extends unknown[]> = [
  Argus,
  Params
] extends [[], Params]
  ? Params
  : [Argus, Params] extends [
      [infer Head1, ...infer Argus],
      [infer Head2, ...infer Params]
    ]
  ? Head1 extends Head2
    ? ApplyPlaceholder<Argus, Params>
    : Head1 extends Placeholder
    ? [Head2, ...ApplyPlaceholder<Argus, Params>]
    : never
  : never;

type CurryingFunction<T extends FunctionType> = <Argus extends unknown[]>(
  ...args: Argus
) => FunctionSpread<T> extends [[...infer Params], infer Return]
  ? ApplyPlaceholder<Argus, Params> extends [...infer Params]
    ? Params extends []
      ? Return
      : CurryingFunction<(...args: Params) => Return>
    : never
  : never;

declare const $: Placeholder;
declare const fooFunc: CurryingFunction<(a: 1, b: 2) => (b: 3, c?: 4) => 5>;
