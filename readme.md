# Rule Engine

A simple rule engine for evaluating conditions and executing actions based on predefined rules.


# JSON Rules Engine Inspired Rule Engine
### A simple rules engine for evaluating conditions and executing actions based on predefined rules.


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

Sets a new rule or updates an existing rule.

### `runRule(fact, ruleIndex)`

Evaluates the rule specified by `ruleIndex` against the provided `fact`.

### `setOperator(symbol, callback)`

Sets a custom operator for the rule engine.

## Example Rules

```javascript
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
        conditions: {
          all: [
            { path: "user.age", operator: "<=", value: 21 },
            { path: "name", operator: "==", value: "d" },
          ],
        },
      },
    ],
  },
  onSuccess: (fact) => console.log("🇺🇸 US adult2 SCUCCESS"),
  onFail: (fact) => console.log("🇺🇸 US adult2 FAILES"),
});
r.runRule(fact, "level3"); // Evaluates the new rule "level3" against the fact
```

## Testing

The rule engine includes unit tests to ensure its functionality. You can run the tests using the following command:

```bash
npm test
```

## License

The rule engine is licensed under the MIT License.
