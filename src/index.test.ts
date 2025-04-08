import { Engine } from "./index";
import { RuleEngine } from "./types";

describe("Engine: Direct flows", () => {
  it("Check 'and' default operators for success", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const rule = [
      {
        name: "testRule",
        condition: {
          and: [
            { path: "age", operator: "!==", value: 10 },
            { path: "age", operator: "!=", value: 11 },
            { path: "age", operator: "===", value: 30 },
            { path: "employee.experience", operator: ">=", value: 10 },
            { path: "age", operator: ">", value: 15 },
            { path: "age", operator: "<", value: 40 },
            { path: "age", operator: "<=", value: 30 },
            { path: "age", operator: "==", value: 30 },
            { path: "skills", operator: "includes", value: "ts" },
            { path: "skills", operator: "!includes", value: "python" },
            { path: "language", operator: "in", value: ["tamil", "english"] },
            { path: "language", operator: "!in", value: ["french", "english"] },
          ],
        },
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
      {
        name: "testRule2",
        condition: {
          and: [
            { path: "employee.role", operator: "like%", value: "tech" },
            { path: "employee.role", operator: "%like", value: "engineer" },
            { path: "employee.role", operator: "%like%", value: "lead" },
          ],
        },
        onSuccess: "Success",
        onFail: "Fail",
      },
    ] as RuleEngine.Rule[];
    const engine = new Engine();
    engine.rule = rule;

    expect(await engine.run(fact, "testRule")).toBe("Success");
    expect(await engine.run(fact, "testRule2")).toBe("Success");
  });

  it("Check 'or' default operators for success", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const rule = [
      {
        name: "testRule",
        condition: {
          or: [
            { path: "age", operator: "!==", value: 30 },
            { path: "age", operator: "!=", value: 11 },
          ],
        },
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
      {
        name: "testRule2",
        condition: {
          or: [
            { path: "employee.role", operator: "like%", value: "operatioon" },
            { path: "employee.role", operator: "%like", value: "engineer" },
          ],
        },
        onSuccess: "Success",
        onFail: "Fail",
      },
    ] as RuleEngine.Rule[];
    const engine = new Engine();
    engine.rule = rule;

    expect(await engine.run(fact, "testRule")).toBe("Success");
    expect(await engine.run(fact, "testRule2")).toBe("Success");
  });

  it("Check default for fail", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const rule = [
      {
        name: "testRule",
        condition: {
          and: [
            { path: "age", operator: "!==", value: 30 },
            { path: "age", operator: "<", value: 20 },
          ],
        },
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
      {
        name: "testRule2",
        condition: {
          or: [
            { path: "employee.role", operator: "like%", value: "operatioon" },
            { path: "employee.role", operator: "%like", value: "CEO" },
          ],
        },
        onSuccess: "Success",
        onFail: "Fail",
      },
    ] as RuleEngine.Rule[];
    const engine = new Engine();
    engine.rule = rule;

    expect(await engine.run(fact, "testRule")).toBe("Fail");
    expect(await engine.run(fact, "testRule2")).toBe("Fail");
  });

  it("Check nested conditions for success", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const rule = [
      {
        name: "testRule",
        condition: {
          and: [
            { path: "age", operator: "!==", value: 10 },
            { path: "age", operator: "!=", value: 11 },
            { path: "age", operator: "===", value: 30 },
            { path: "employee.experience", operator: ">=", value: 10 },
            {
              and: [
                { path: "age", operator: ">", value: 15 },
                { path: "age", operator: "<", value: 40 },
                { path: "age", operator: "<=", value: 30 },
                {
                  or: [
                    { path: "age", operator: "!==", value: 30 },
                    { path: "skills", operator: "includes", value: "ts" },
                    { path: "skills", operator: "includes", value: "python" },
                  ],
                },
              ],
            },
            { path: "language", operator: "in", value: ["tamil", "english"] },
            { path: "language", operator: "!in", value: ["french", "english"] },
          ],
        },
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
      {
        name: "testRule2",
        condition: {
          and: [
            { path: "employee.role", operator: "like%", value: "tech" },
            { path: "employee.role", operator: "%like", value: "engineer" },
            { path: "employee.role", operator: "%like%", value: "lead" },
          ],
        },
        onSuccess: "Success",
        onFail: "Fail",
        cache: false,
      },
    ] as RuleEngine.Rule[];
    const engine = new Engine();
    engine.rule = rule;

    expect(await engine.run(fact, "testRule")).toBe("Success");
    expect(await engine.run(fact, "testRule2")).toBe("Success");
  });
});

describe("Engine: Exceptions", () => {
  it("Check error for unknown rule", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const engine = new Engine();

    expect(engine.run(fact, "unknown")).rejects.toThrow(
      'Rule "unknown" not found'
    );
  });

  it("Check error for unknown condition", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const engine = new Engine();
    engine.rule = [
      {
        name: "testRule",
        condition: "unknown",
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
    ];

    expect(engine.run(fact, "testRule")).rejects.toThrow(
      'Condition "unknown" not found'
    );
  });

  it("Check error for unknown operator", async () => {
    const fact = {
      name: "John Doe",
      age: 30,
      skills: ["js", "ts", "php"],
      language: "tamil",
      employee: {
        experience: 11,
        role: "tech lead engineer",
      },
    };
    const engine = new Engine();
    engine.rule = [
      {
        name: "testRule",
        condition: { and: [{ path: "age", operator: "unknown", value: 30 }] },
        onSuccess: () => "Success",
        onFail: () => "Fail",
      },
    ];

    expect(engine.run(fact, "testRule")).rejects.toThrow(
      'Operator "unknown" not found'
    );
  });
});
