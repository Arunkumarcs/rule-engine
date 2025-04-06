const _ = require("lodash");

class RuleEngine {
  defaultOperators = {
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

  constructor(rules) {
    this.rules = new Map();
    this.operators = new Map();

    this._initial(rules);
  }

  _initial(rules) {
    for (const key in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, key)) {
        this.rules.set(key, rules[key]);
      }
    }

    for (const key in this.defaultOperators) {
      if (Object.prototype.hasOwnProperty.call(this.defaultOperators, key)) {
        this.operators.set(key, this.defaultOperators[key]);
      }
    }
  }

  _evaluateCondition(fact, { path, operator, value }) {
    const actual = _.get(fact, path);
    const fn = this.operators.get(operator);
    return fn ? fn(actual, value) : false;
  }

  _eventRuleCallback(fact) {
    return (cond) => {
      if (cond.conditions) {
        return this._evaluateRule(fact, cond);
      } else {
        return this._evaluateCondition(fact, cond);
      }
    };
  }

  _evaluateRule(fact, rule) {
    const { conditions } = rule;
    if (conditions.all) {
      return conditions.all.every(this._eventRuleCallback(fact));
    }
    if (conditions.any) {
      return conditions.any.some((cond) => this._evaluateCondition(fact, cond));
    }
    return false;
  }

  setOperator(symbol, callback) {
    if (!this.operators.has(symbol)) {
      this.operators.set(symbol, callback);
      return [true, false];
    }
    return [false, "ALREADY_EXIST"];
  }

  setRule(name, rule) {
    if (!this.rules.has(name)) {
      this.rules.set(name, rule);
      return [true, false];
    }
    return [false, "ALREADY_EXIST"];
  }

  runRule(fact, ruleIndex) {
    const rule = this.rules.get(ruleIndex);
    if (this._evaluateRule(fact, rule)) {
      return rule.onSuccess(fact);
    }
    return rule.onFail(fact);
  }
}

const rules = {
  level1: {
    conditions: {
      all: [
        { path: "user.age", operator: ">=", value: 18 },
        { path: "user.country", operator: "===", value: "US" },
        {
          conditions: {
            all: [
              { path: "user.age", operator: "<=", value: 21 },
              { path: "name", operator: "==", value: "dd" },
            ],
          },
        },
      ],
    },
    onSuccess: () => console.log("🇺🇸 US adult SCUCCESS"),
    onFail: () => console.log("🇺🇸 US adult FAILES"),
  },
  level2: {
    conditions: {
      any: [
        { path: "user.role", operator: "==", value: "admin" },
        { path: "user.accessLevel", operator: ">=", value: 5 },
      ],
    },
    onSuccess: () => console.log("🔓 Elevated access SCUCCESS"),
    onFail: () => console.log("🔓 Elevated access FAILES"),
  },
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

let r = new RuleEngine(rules);
r.runRule(fact, "level1");
r.setRule("level3", {
  conditions: {
    all: [
      { path: "user.age", operator: ">=", value: 18 },
      { path: "user.country", operator: "===", value: "US" },
      {
        conditions: {
          all: [
            { path: "user.age", operator: "<=", value: 21 },
            { path: "name", operator: "==", value: "d" },
          ],
        },
      },
    ],
  },
  onSuccess: () => console.log("🇺🇸 US adult2 SCUCCESS"),
  onFail: () => console.log("🇺🇸 US adult2 FAILES"),
});

r.runRule(fact, "level3");
