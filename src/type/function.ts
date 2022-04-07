import { TrimTuple } from "./tuple";

export type FunctionType = (...args: any[]) => any;

export const placeholder = Symbol("placeholder");

export interface Placeholder {
  [placeholder]: unknown;
}

type ApplyWithPlaceholder<Args extends unknown[], Params extends unknown[]> = [
  Args,
  Params
] extends [[], Params]
  ? Params
  : [Args, Params] extends [
      [infer Head1, ...infer Args],
      [infer Head2, ...infer Params]
    ]
  ? Head1 extends Head2
    ? ApplyWithPlaceholder<Args, Params>
    : Head1 extends Placeholder
    ? [Head2, ...ApplyWithPlaceholder<Args, Params>]
    : never
  : never;

type RawFunction<T extends FunctionType> = T extends Currying<infer T> ? T : T;

type FunctionSpread<T extends FunctionType> = RawFunction<T> extends (
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

export type Currying<T extends FunctionType> = <Args extends unknown[]>(
  ...args: Args
) => FunctionSpread<T> extends (...args: infer Params) => infer Return
  ? ApplyWithPlaceholder<Args, Params> extends [...infer Params]
    ? Params extends []
      ? Return
      : Currying<(...args: Params) => Return>
    : never
  : never;
