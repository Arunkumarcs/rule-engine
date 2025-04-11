# Rule Engine

A light weight rule engine for evaluating conditions and executing actions based on predefined rules.

[![NPM Version](https://img.shields.io/npm/v/@arunkumar_h/rule-engine)](https://www.npmjs.com/package/@arunkumar_h/rule-engine)
[![NPM Downloads](https://img.shields.io/npm/dm/@arunkumar_h/rule-engine)](https://www.npmjs.com/package/@arunkumar_h/rule-engine)
[![License](https://img.shields.io/npm/l/@arunkumar_h/rule-engine)](https://github.com/arunkumar-h/rule-engine/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@arunkumar_h/rule-engine)](https://bundlephobia.com/package/@arunkumar_h/rule-engine)
[![Install size](https://packagephobia.com/badge?p=@arunkumar_h/rule-engine)](https://packagephobia.com/result?p=@arunkumar_h/rule-engine)

[![badge-branches](badges/badge-branches.svg)](badges/badge-branches.svg)
[![badge-functions](badges/badge-functions.svg)](badges/badge-functions.svg)
[![badge-lines](badges/badge-lines.svg)](badges/badge-lines.svg)
[![badge-statements](badges/badge-statements.svg)](badges/badge-statements.svg)


## Installation

```bash
npm install @arunkumar_h/rule-engine
```

## Usage

```javascript
const RuleEngine = require('@arunkumar_h/rule-engine');
const rules = {
  // Define your rules here
};
const fact = {
  // Define your fact here
};

let r = new RuleEngine(rules);
r.runRule(fact, "ruleName"); // Replace "ruleName" with the actual rule name
```

## API

### `new RuleEngine(rules)`

Creates a new instance of the RuleEngine with the provided rules.

### `setRule(name, rule)`

Add  new rule.

### `runRule(fact, ruleIndex)`

Evaluates the rule specified by `ruleIndex` against the provided `fact`.

### `setOperator(symbol, callback)`

Add new custom operator for the rule engine.

## Example Rules

```javascript
const rules = {
  level1: {
    conditions: {
      all: [
        { path: "user.age", operator: ">=", value: 18 },
        { path: "user.country", operator: "===", value: "US" },
        {
          all: [
            { path: "user.age", operator: "<=", value: 21 },
            { path: "name", operator: "==", value: "dd" },
          ],
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
```

## Example Fact

```javascript
const fact = {
  user: {
    age: 21,
    country: "US",
    role: "editor",
    accessLevel: 6,
  },
  name: "d",
};
```

## Running the Rule Engine


```javascript
let r = new RuleEngine(rules);
r.runRule(fact, "level1"); // Evaluates the rule "level1" against the fact
r.setRule("level3", {
  conditions: {
    all: [
      { path: "user.age", operator: ">=", value: 18 },
      { path: "user.country", operator: "===", value: "US" },
      {
        all: [
          { path: "user.age", operator: "<=", value: 21 },
          { path: "name", operator: "==", value: "d" },
        ],
      },
    ],
  },
  onSuccess: async (fact) => console.log("🇺🇸 US adult2 SCUCCESS"),
  onFail: async (fact) => console.log("🇺🇸 US adult2 FAILES"),
});
r.runRule(fact, "level3"); // Evaluates the new rule "level3" against the fact
```

## Adding Custom Operator

You can add a custom operator to the rule engine using the `setOperator` method. Here's an example:

```javascript
r.setOperator("eq", async (a, b) => a === b);
```

This will add a new operator `eq` to the rule engine, which checks for strict equality.


## Testing

The rule engine includes unit tests to ensure its functionality. You can run the tests using the following command:

```bash
npm test
```

## License

The rule engine is licensed under the MIT License.
