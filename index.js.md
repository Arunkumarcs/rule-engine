const _ = require("lodash");

const operators = {
  "===": (a, b) => a === b,
  "==": (a, b) => a == b,
  "!==": (a, b) => a !== b,
  "!=": (a, b) => a != b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  in: (a, b) => Array.isArray(a) && a.includes(b),
};

function evaluateCondition(fact, { path, operator, value }) {
  const actual = _.get(fact, path);
  const fn = operators[operator];
  return fn ? fn(actual, value) : false;
}

function eventRuleCallback(fact) {
  return (cond) => {
    if (cond.conditions) {
      return evaluateRule(fact, cond);
    } else {
      return evaluateCondition(fact, cond);
    }
  };
}

function evaluateRule(fact, rule) {
  const { conditions } = rule;
  if (conditions.all) {
    return conditions.all.every(eventRuleCallback(fact));
  }
  if (conditions.any) {
    return conditions.any.some((cond) => evaluateCondition(fact, cond));
  }
  return false;
}

function runRules(fact, rules) {
  for (const ruleIndex in rules) {
    const ruleContent = rules[ruleIndex];
    if (evaluateRule(fact, ruleContent)) {
      ruleContent.action(fact);
    }
  }
}

const rules = {
  level1: {
    conditions: {
      all: [
        { path: "user.age", operator: ">=", value: 18 },
        { path: "user.country", operator: "===", value: "US" },
        // {
        //   conditions: {
        //     all: [{ path: "user.age", operator: "lte", value: 18 }],
        //   },
        // },
      ],
    },
    action: (facts) => console.log("🇺🇸 US adult"),
  },
  //   level2: {
  //     conditions: {
  //       any: [
  //         { path: "user.role", operator: "eq", value: "admin" },
  //         { path: "user.accessLevel", operator: "gte", value: 5 },
  //       ],
  //     },
  //     action: () => console.log("🔓 Elevated access"),
  //   },
};
const fact = {
  user: {
    age: 21,
    country: "US",
    role: "editor",
    accessLevel: 6,
  },
  name: "d",
};

runRules(fact, rules);
