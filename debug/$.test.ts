import { $ } from "facade.ts";

describe("foo", () => {
  const source = (a1: string, b1: number, c1: boolean) => {
    return (a2: string, b2: number, c2: boolean) => {
      return (a3: string, b3: number, c3: boolean) => {
        return (a4: string, b4: number, c4: boolean) => {
          return [
            a1 + a2 + a3 + a4,
            b1 + b2 + b3 + (b4 ?? 1000),
            c1 && c2 && c3 && c4,
          ];
        };
      };
    };
  };

  const fooFunc = $(source);

  test("test-1", () => {
    expect(fooFunc).toEqual(fooFunc());
  });

  test("test-2", () => {
    expect(
      fooFunc("1", 2, true, "4", 5, true, "7", 8, true, "10", 11, true)
    ).toEqual(source("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });

  test("test-3", () => {
    expect(
      fooFunc("1", 2)(true, "4", 5, true, "7")(8, true, "10")(11, true)
    ).toEqual(source("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });

  test("test-4", () => {
    expect(
      fooFunc("1", $)(2)($, "4", $, true, "7")(true, 5, $, true, $)(
        $,
        $,
        11,
        true
      )(8, "10")
    ).toEqual(source("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });
});
