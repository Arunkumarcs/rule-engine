import {
  defaultOperators,
  startsWith,
  endsWith,
  includes,
  get,
  typeGuardCondition,
  memoize,
} from "./helper";

import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, boolean>({ max: 100 });
function getValidInputsForOperator(operator: keyof typeof defaultOperators) {
  switch (operator) {
    case "%like%":
      return [
        ["hello world", "world"],
        ["hello world", "hello"],
      ];
    case "%like":
      return [
        ["hello world", "world"],
        ["hello world", "ld"],
      ];
    case "like%":
      return [
        ["hello world", "hello"],
        ["hello world", "he"],
      ];
    case "===":
      return [
        [1, 1],
        ["hello", "hello"],
      ];
    case "==":
      return [
        [1, "1"],
        ["hello", "hello"],
      ];
    case "!==":
      return [
        [1, 2],
        ["hello", "world"],
      ];
    case "!=":
      return [
        [1, 2],
        ["hello", "world"],
      ];
    case ">":
      return [
        [2, 1],
        ["hello", ""],
      ];
    case ">=":
      return [
        [2, 1],
        [2, 2],
        ["hello", "hello"],
      ];
    case "<":
      return [
        [1, 2],
        ["", "hello"],
      ];
    case "<=":
      return [
        [1, 2],
        [1, 1],
        ["", "hello"],
      ];
    case "in":
      return [
        [1, [1, 2, 3]],
        ["hello", ["hello", "world"]],
      ];
    case "!in":
      return [
        [1, [2, 3]],
        ["hello", ["world"]],
      ];
    case "includes":
      return [
        [[1, 2, 3], 1],
        [["hello", "world"], "hello"],
        [{ name: "John", age: 20 }, "John"],
      ];
    default:
      return [];
  }
}

function getInvalidInputsForOperator(operator: keyof typeof defaultOperators) {
  switch (operator) {
    case "%like%":
      return [
        ["hello world", "foo"],
        ["hello world", 123],
      ];
    case "%like":
      return [
        ["hello world", "foo"],
        ["hello world", 123],
      ];
    case "like%":
      return [
        ["hello world", "foo"],
        ["hello world", 123],
      ];
    case "===":
      return [
        [1, 2],
        ["hello", "world"],
      ];
    case "==":
      return [
        [1, 2],
        ["hello", "world"],
      ];
    case "!==":
      return [
        [1, 1],
        ["hello", "hello"],
      ];
    case "!=":
      return [
        [1, 1],
        ["hello", "hello"],
      ];
    case ">":
      return [
        [1, 2],
        [2, 2],
        ["hello", "hello"],
      ];
    case ">=":
      return [
        [1, 2],
        ["", "hello"],
      ];
    case "<":
      return [
        [2, 1],
        [1, 1],
        ["hello", "hello"],
      ];
    case "<=":
      return [
        [2, 1],
        ["hello", ""],
      ];
    case "in":
      return [
        [1, [2, 3]],
        ["hello", ["world"]],
      ];
    case "!in":
      return [
        [1, [1, 2, 3]],
        ["hello", ["hello", "world"]],
      ];
    case "includes":
      return [
        [1, [2, 3]],
        ["hello", ["world"]],
      ];
    default:
      return [];
  }
}

Object.keys(defaultOperators).forEach((operator) => {
  describe(`defaultOperators: ${operator}`, () => {
    it("should return true for valid inputs for " + operator, () => {
      const validInputs = getValidInputsForOperator(
        operator as keyof typeof defaultOperators
      );
      validInputs.forEach((input) => {
        expect(
          defaultOperators[operator as keyof typeof defaultOperators](
            input[0],
            input[1]
          )
        ).toBe(true);
      });
    });

    it("should return false for invalid inputs for " + operator, () => {
      const invalidInputs = getInvalidInputsForOperator(
        operator as keyof typeof defaultOperators
      );
      invalidInputs.forEach((input) => {
        expect(
          defaultOperators[operator as keyof typeof defaultOperators](
            input[0],
            input[1]
          )
        ).toBe(false);
      });
    });
  });
});

describe("memoize", () => {
  it("memoize positive flow", () => {
    const memoizedFunction = memoize(
      cache,
      (a: number, b: number) => a + b,
      (a, b) => `${a}-${b}`
    );
    expect(memoizedFunction(1, 2)).toBe(3);
    expect(memoizedFunction(1, 2)).toBe(3);

    const memoizedFunction2 = memoize(cache, (a: number, b: number) => a + b);
    expect(memoizedFunction2(1, 2)).toBe(3);
    expect(memoizedFunction2(1, 2)).toBe(3);
  });
});


describe("typeGuardCondition", () => {
  it("typeGuardCondition positive flow", () => {
    expect(typeGuardCondition({ and: {} })).toBe(true);
    expect(typeGuardCondition({ or: {} })).toBe(true);
  });

  it("typeGuardCondition negative flow", () => {
    expect(typeGuardCondition({})).toBe(false);
  });
});

describe("defaultOperators", () => {
  it("should have the correct operators", () => {
    expect(Object.keys(defaultOperators)).toEqual([
      "%like%",
      "%like",
      "like%",
      "===",
      "==",
      "!==",
      "!=",
      ">",
      ">=",
      "<",
      "<=",
      "in",
      "!in",
      "includes",
    ]);
  });

  it("should have functions as values", () => {
    Object.values(defaultOperators).forEach((operator) => {
      expect(typeof operator).toBe("function");
    });
  });
});

describe("startsWith", () => {
  it("positive flow for startsWith", () => {
    expect(startsWith("hello world", "hello")).toBe(true);
    expect(startsWith("hello world", "ello", 1)).toBe(true);
  });

  it("negative flow for startsWith", () => {
    expect(startsWith("hello world", "ello")).toBe(false);
    expect(startsWith("hello world", "hello", 1)).toBe(false);
  });
});

describe("endsWith", () => {
  it("positive flow for endsWith", () => {
    expect(endsWith("hello world", "world")).toBe(true);
    expect(endsWith("hello world", "orl", 10)).toBe(true);
  });
});

describe("get", () => {
  it("get positive flow", () => {
    expect(
      get(
        {
          foo: [
            { age: 20 },
            { age: 25 },
            { age: 30 },
            { age: 35 },
            { age: 40 },
          ],
        },
        "foo[?age > `30`]"
      )
    ).toStrictEqual([{ age: 35 }, { age: 40 }]);
  });
});
