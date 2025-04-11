import { describe, it, expect } from "@jest/globals";
import { RuleEngine } from "./index";

describe("RuleEngine", () => {
  it("should evaluate a rule with all conditions", async () => {
    const fact = { name: "John Doe", age: 30, country: "USA" };
    const rule = {
      conditions: {
        all: [
          { path: "age", operator: ">", value: 18 },
          { path: "country", operator: "==", value: "USA" },
          {
            all: [{ path: "name", operator: "==", value: "John Doe" }],
          },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with any conditions", async () => {
    const fact = { name: "John Doe", age: 30, country: "Canada" };
    const rule = {
      conditions: {
        any: [
          { path: "age", operator: "<", value: 18 },
          { path: "country", operator: "!==", value: "USA" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };

    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with a single condition", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 18 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with a condition that fails", async () => {
    const fact = { name: "John Doe", age: 15 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 18 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    const result = await engine.runRule(fact, "testRule");
    expect(result).toBe("Fail");
  });

  it("should set a custom operator", async () => {
    const engine = new RuleEngine({});
    const result = await engine.setOperator("eq", async (a, b) => a === b);
    expect(result).toEqual(true);
  });

  it("should set a rule", async () => {
    const engine = new RuleEngine({});
    const result = await engine.setRule("testRule", {});
    expect(result).toEqual(true);
  });
});
