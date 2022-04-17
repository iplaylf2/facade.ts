import { $, $class, compose } from "facade.ts";

describe("$", () => {
  const foo = (a1: string, b1: number, c1: boolean) => {
    return (a2: string, b2: number, c2: boolean) => {
      return (a3: string, b3: number, c3: boolean) => {
        return (a4: string, b4: number, c4: boolean) => {
          return [a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4];
        };
      };
    };
  };

  const cfoo = $(foo);

  test("1", () => {
    expect(cfoo()).toEqual(cfoo);
  });

  test("1.1", () => {
    expect($(cfoo)).toEqual(cfoo);
  });

  test("2", () => {
    expect(
      cfoo("1", 2, true, "4", 5, true, "7", 8, true, "10", 11, true)
    ).toEqual(foo("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });

  test("3", () => {
    expect(
      cfoo("1", 2)(true, "4", 5, true, "7")(8, true, "10")(11, true)
    ).toEqual(foo("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });

  test("4", () => {
    expect(
      cfoo("1", $)(2)($, "4", $, true, "7")(true, 5, $, true, $)(
        $,
        $,
        11,
        true
      )(8, "10")
    ).toEqual(foo("1", 2, true)("4", 5, true)("7", 8, true)("10", 11, true));
  });

  test("5", () => {
    const foo = (a: string, b = 5) => a.repeat(b);
    const cfoo = $(foo, 1);

    expect(cfoo("zzz")).toEqual(foo("zzz"));
  });
});

describe("$class", () => {
  class Foo {
    constructor(public a: number, public b: string, public c: boolean) {}
  }

  const CFoo = $class(Foo);

  test("1", () => {
    expect(CFoo(1, "2", true)).toEqual(new Foo(1, "2", true));
  });

  test("2", () => {
    expect(CFoo(1)("2")(true)).toEqual(new Foo(1, "2", true));
  });

  test("3", () => {
    class Foo {
      constructor(public a: number, public b: string = "aaa") {}
    }

    const CFoo = $class(Foo, 1);
    expect(CFoo(1)).toEqual(new Foo(1));
  });
});

describe("compose", () => {
  const a = (x: string) => x.length;
  const b = (x: number) => x % 2 === 0;
  const c = (x: boolean) => x.toString();

  test("1", () => {
    const x = "zzzz";
    expect(compose(a, b, c)(x)).toEqual(c(b(a(x))));
  });

  test("2", () => {
    const x = "zzzzz";
    expect(compose(a, b, c)(x)).toEqual(c(b(a(x))));
  });
});
