import { describe, it, expect } from "@jest/globals";
import { RuleEngine } from "./index";




describe("RuleEngine", () => {
  it("should evaluate a rule with the '===' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "===", value: 30 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '!==' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "!==", value: 31 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '>' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 29 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '>=' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">=", value: 30 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '<' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "<", value: 31 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '<=' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "<=", value: 30 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '==' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "==", value: 30 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the '!=' operator and succeed", async () => {
    const fact = { name: "John Doe", age: 30 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: "!=", value: 31 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with the 'like%' operator and Fail", async () => {
    const fact = { name: "John Doe" };
    const rule = {
      conditions: {
        all: [{ path: "name", operator: "like%", value: "Doe" }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Fail");
  });

  it("should evaluate a rule with the 'like%' operator and succeed", async () => {
    const fact = { name: "John Doe" };
    const rule = {
      conditions: {
        all: [{ path: "name", operator: "like%", value: "John" }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    const result = await engine.runRule(fact, "testRule");
    expect(result).toBe("Success");
  });

  it("should evaluate a rule with the '%like%' operator and succeed", async () => {
    const fact = { name: "John Doe" };
    const rule = {
      conditions: {
        all: [{ path: "name", operator: "%like%", value: "hn" }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should throw an error if the rule is not found", async () => {
    const engine = new RuleEngine();
    await expect(engine.runRule({}, "nonExistentRule")).rejects.toThrow(
      "Rule nonExistentRule not found"
    );
  });

  it("should evaluate a rule with a single condition and succeed", async () => {
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

  it("should evaluate a rule with any conditions and succeed", async () => {
    const fact = { name: "Jane Doe", age: 30, country: "USA" };
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
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with nested conditions and fail 1", async () => {
    const fact = {
      name: "John Doe",
      age: 29,
      country: "USA",
      occupation: "Developer",
    };
    const rule = {
      conditions: {
        all: [
          {
            all: [
              { path: "age", operator: ">", value: 18 },
              { path: "country", operator: "==", value: "India" },
            ],
          },
          { path: "occupation", operator: "==", value: "Developer" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Fail");
  });

  it("should evaluate a rule with nested conditions", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      country: "USA",
      occupation: "Developer",
    };
    const rule = {
      conditions: {
        all: [
          {
            all: [
              { path: "age", operator: ">", value: 18 },
              { path: "country", operator: "==", value: "USA" },
            ],
          },
          { path: "occupation", operator: "==", value: "Developer" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Success");
  });

  it("should evaluate a rule with a single condition and fail", async () => {
    const fact = { name: "Jane Doe", age: 17 };
    const rule = {
      conditions: {
        all: [{ path: "age", operator: ">", value: 18 }],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Fail");
  });

  it("should evaluate a rule with any conditions and fail", async () => {
    const fact = { name: "Jane Doe", age: 30, country: "Canada" };
    const rule = {
      conditions: {
        any: [
          { path: "age", operator: "<", value: 18 },
          { path: "country", operator: "==", value: "USA" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };

    const engine = new RuleEngine({ testRule: rule });
    expect(await engine.runRule(fact, "testRule")).toBe("Fail");
  });

  it("should evaluate a rule with nested conditions and fail", async () => {
    const fact = {
      name: "Jane Doe",
      age: 29,
      country: "Canada",
      occupation: "Manager",
    };
    const rule = {
      conditions: {
        all: [
          {
            all: [
              { path: "age", operator: ">", value: 18 },
              { path: "country", operator: "==", value: "USA" },
            ],
          },
          { path: "occupation", operator: "==", value: "Developer" },
        ],
      },
      onSuccess: () => "Success",
      onFail: () => "Fail",
    };
    const engine = new RuleEngine({ testRule: rule });
    const result = await engine.runRule(fact, "testRule");
    expect(result).toBe("Fail");
  });

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
