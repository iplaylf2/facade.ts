type FunctionType = (...args: any[]) => any;

type FunctionSpread<T extends FunctionType> = T extends (
  ...args: infer Params
) => infer Return
  ? Return extends FunctionType
    ? FunctionSpread<Return> extends [[...infer RestParams], infer FinalReturn]
      ? [[...Params, ...RestParams], FinalReturn]
      : never
    : [Params, Return]
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
declare const fooFunc: CurryingFunction<(a: "a") => (b: "b", c: "c") => "d">;

const x = fooFunc("a" as const, $, "c" as const);
