import Engine, {
  includes,
  endsWith,
  startsWith,
  get,
  memoize,
  typeGuardCondition,
} from "./index";
import { defaultOperators } from "./helper";

const mockRule = {
  test: {
    condition: {
      and: [
        {
          path: "name",
          operator: "==",
          value: "John",
        },
        "checkAge",
        {
          or: [
            {
              path: "department",
              operator: "==",
              value: "IT",
            },
            {
              path: "department",
              operator: "==",
              value: "HR",
            },
          ],
        },
      ],
    },
    onSuccess: () => {
      return "success";
    },
    onFail: () => {
      return "fail";
    },
  },
  test2: {
    condition: {
      and: [
        {
          path: "name",
          operator: "==",
          value: "John",
        },
      ],
    },
    onSuccess: "success",
    onFail: "fail",
    cache: false,
  },
  test3: {
    condition: "invalidCondition",
    onSuccess: "success",
    onFail: "fail",
    cache: false,
  },
  test4: {
    condition: {
      and: [
        {
          path: "name",
          operator: "sub",
          value: "John",
        },
      ],
    },
    onSuccess: "success",
    onFail: "fail",
    cache: false,
  },
};
const mockCondition = {
  checkAge: {
    and: [
      {
        path: "age",
        operator: "gte",
        value: 18,
      },
    ],
  },
};
const mockOperator = {
  gte: (a: any, b: any) => a >= b,
};

describe("Engine positive result", () => {
  it("should be defined", () => {
    expect(Engine).toBeDefined();
    expect(memoize).toBeDefined();
    expect(includes).toBeDefined();
    expect(endsWith).toBeDefined();
    expect(startsWith).toBeDefined();
    expect(get).toBeDefined();
    expect(typeGuardCondition).toBeDefined();
  });

  it("direct positive result", async () => {
    const engine = new Engine();

    engine.addRule(mockRule);

    engine.addCondition(mockCondition);
    engine.addOperator(mockOperator);

    expect(
      await engine.run({ name: "John", age: 20, department: "IT" }, "test")
    ).toBe("success");
    expect(await engine.run({ name: "Joh" }, "test")).toBe("fail");
    expect(await engine.run({ name: "Joh" }, "test")).toBe("fail");
    expect(await engine.run({ name: "Joh" }, "test")).toBe("fail");

    expect(engine.rule).toMatchObject(mockRule);
    expect(engine.condition).toMatchObject({
      checkAge: { and: [{ operator: "gte", path: "age", value: 18 }] },
    });
    expect(engine.operator).toMatchObject({
      ...defaultOperators,
      ...mockOperator,
    });
  });

  it("direct positive result2", async () => {
    const engine = new Engine();
    engine.addRule(mockRule);

    expect(
      await engine.run({ name: "John", age: 20, department: "IT" }, "test2")
    ).toBe("success");
    expect(await engine.run({ name: "Joh" }, "test2")).toBe("fail");
  });
});

describe("Engine negative result", () => {
  it("direct negative result", async () => {
    const engine = new Engine();
    engine.addRule(mockRule);

    await expect(engine.run({ name: "Joh" }, "tes_invalid")).rejects.toThrow(
      'Rule "tes_invalid" not found'
    );
    await expect(engine.run({ name: "Joh" }, "test3")).rejects.toThrow(
      'Condition "invalidCondition" not found'
    );
    await expect(engine.run({ name: "Joh" }, "test4")).rejects.toThrow(
      'Operator "sub" not found'
    );
  });
});
