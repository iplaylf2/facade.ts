export const placeholder = Symbol("placeholder");

export interface Placeholder {
  [placeholder]: unknown;
}

export type ApplyWithPlaceholder<Args extends unknown[], Params extends unknown[]> = [
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