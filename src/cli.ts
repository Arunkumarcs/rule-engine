import { Engine } from "./index.js";

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

async function main() {
  const engine = new Engine();
  engine.addRule(mockRule);
  engine.addCondition(mockCondition);
  engine.addOperator(mockOperator);
  console.log(
    await engine.run({ name: "John", age: 20, department: "IT" }, "test")
  );
}

main();
