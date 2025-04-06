import { describe, it, expect } from "@jest/globals";
import RuleEngine from "./index";

describe("RuleEngine", () => {
  it("should evaluate a rule with all conditions", () => {
    const fact = { name: "John Doe", age: 30, country: "USA" };
    const rule = {
      conditions: {
        all: [
          { path: "age", operator: ">", value: 18 },
          { path: "country", operator: "==", value: "USA" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with any conditions", () => {
    const fact = { name: "John Doe", age: 30, country: "Canada" };
    const rule = {
      conditions: {
        any: [
          { path: "age", operator: ">", value: 18 },
          { path: "country", operator: "==", value: "USA" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };

    const engine = new RuleEngine({ testRule: rule });
    expect(engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with a single condition", () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 18 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with a condition that fails", () => {
    const fact = { name: "John Doe", age: 15 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 18 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(engine.runRule(fact, "testRule")).toBe("Fail");
  });

  it("should set a custom operator", () => {
    const engine = new RuleEngine({});
    const result = engine.setOperator("eq", (a, b) => a === b);
    expect(result).toEqual(true);
  });

  it("should set a rule", () => {
    const engine = new RuleEngine({});
    const result = engine.setRule("testRule", {});
    expect(result).toEqual(true);
  });
});
