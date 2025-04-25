# @arunkumar_h/rule-engine

[![Known Vulnerabilities](https://snyk.io/test/github/Arunkumarcs/rule-engine/badge.svg)](https://snyk.io/test/github/Arunkumarcs/rule-engine)
[![NPM Version](https://img.shields.io/npm/v/@arunkumar_h/rule-engine)](https://www.npmjs.com/package/@arunkumar_h/rule-engine)
[![NPM Downloads](https://img.shields.io/npm/dm/@arunkumar_h/rule-engine)](https://www.npmjs.com/package/@arunkumar_h/rule-engine)
[![License](https://img.shields.io/npm/l/@arunkumar_h/rule-engine)](https://github.com/arunkumar-h/rule-engine/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@arunkumar_h/rule-engine)](https://bundlephobia.com/package/@arunkumar_h/rule-engine)
[![Install size](https://packagephobia.com/badge?p=@arunkumar_h/rule-engine)](https://packagephobia.com/result?p=@arunkumar_h/rule-engine)

[![badge-branches](badges/badge-branches.svg)](badges/badge-branches.svg)
[![badge-functions](badges/badge-functions.svg)](badges/badge-functions.svg)
[![badge-lines](badges/badge-lines.svg)](badges/badge-lines.svg)
[![badge-statements](badges/badge-statements.svg)](badges/badge-statements.svg)

---

**Breaking Change:** Please move to v3.1.0 or later.

<!-- [More info here.](#breaking-change) -->

---

A lightweight and extensible rule engine built with TypeScript and Node.js. Define complex business rules and evaluate conditions easily using a simple JSON structure.

## 📦 Installation

```bash
npm install @arunkumar_h/rule-engine
```

```bash
yarn add @arunkumar_h/rule-engine
```

## 🧠 Features

- ✅ Logical condition support (and, or, nested expressions)
- 🔧 Custom operators and named conditions
- 📜 Fully typed with TypeScript
- 🚀 Lightweight and dependency-aware
- 🔎 Native [JMESPath](https://jmespath.org/) support for data querying
- 🧰 Built-in caching using [`lru-cache`](https://isaacs.github.io/node-lru-cache/) for better performance

| Feature / Capability         | @arunkumar_h/rule-engine                        |
| ---------------------------- | ----------------------------------------------- |
| ✅ Written in TypeScript     | ✅ Native TypeScript with full type safety      |
| ⚙️ Custom Operators          | ✅ Built-in support, sync or async              |
| 🧠 Named Conditions          | ✅ Supports reusable named conditions           |
| 🧱 Nested Logical Trees      | ✅ Fully supported (and, or, deeply nested)     |
| 🔍 Data Query Language       | ✅ Built-in JMESPath support                    |
| 🚀 Performance Optimizations | ✅ Rule-level cache with lru-cache              |
| 🧰 Extensibility             | ✅ Add custom operators, conditions dynamically |
| ⚖️ Lightweight               | ✅ Small and focused build                      |
| 🧪 Testing Coverage Ready    | ✅ Easy to unit test each rule block            |
| 🔁 Dynamic Rule Loading      | ✅ Add/modify rules at runtime                  |
| 🔄 Async Support             | ✅ Full async engine and operators              |
| 📦 Modern Packaging          | ✅ ESM + CJS + .d.ts types out of the box       |

## ⚙️ Default Operators

The following operators are available by default:

| Operator  | Description                  |
| --------- | ---------------------------- |
| ===       | Strict equality              |
| !==       | Strict inequality            |
| ==        | Loose equality               |
| !=        | Loose inequality             |
| >         | Greater than                 |
| >=        | Greater than or equal to     |
| <         | Less than                    |
| <=        | Less than or equal to        |
| %like     | Starts with                  |
| like%     | Ends with                    |
| %like%    | Contains                     |
| in        | Value is in the array        |
| !in       | Value is not in the array    |
| includes  | Array includes value         |
| !includes | Array does not include value |

## 🔨 Basic Usage

- `condition` This containes `and` and `or` as main block.
- `onSuccess` value that will be returned or function that will be invoked if the condition is satisfied.
- `onFail` value that will be returned or function that will be invoked if the condition fails.
- `cache` as default this will be set to `true` and can be disabled for rule wise `false`

```javascript
import { Engine } from "@arunkumar_h/rule-engine";

const engineObj = new Engine();
const rule = {
  testRule: {
    condition: {
      and: [
        { path: "age", operator: "!==", value: 10 },
        {
          and: [
            { path: "age", operator: ">", value: 15 },
            {
              or: [
                { path: "age", operator: "!==", value: 30 },
                { path: "skills", operator: "includes", value: "ts" },
              ],
            },
          ],
        },
        { path: "language", operator: "in", value: ["tamil", "english"] },
      ],
    },
    onSuccess: (fact, ruleName) => "Success", // onSuccess: { id: 23 }
    onFail: (fact, ruleName) => "Fail", // onFail: "Error"
    cache: false, // default will be true
  },
};
engine.addRule(rule);

const fact = { age: 16, skills: ["ts", "php"], language: "tamil" }; // Your data to be validated
const result = await engineObj.run(fact, "testRule");
```

## 🔧 Custom Operator Example

```javascript
engine.addOperator({
  isEven: (factValue) => factValue % 2 === 0,
});

const rule = {
  evenCheck: {
    condition: {
      and: [{ path: "number", operator: "isEven" }],
    },
    onSuccess: "Number is even",
    onFail: "Number is odd",
  },
};

const result = await engine.run({ number: 8 }, "evenCheck");
```

## 🔍 API Overview

```mermaid
flowchart TB
    Rule --> onSuccess
    Rule --> onFail
    Rule --> Condition --> AND --> Operation
    Condition --> OR --> Operation
```

### Engine API

```javascript
let engine = new Engine();
```

addRule({ rule1, rule2, ... })

- Add named rules dynamically.

addCondition({ condition1, condition2, ... })

- Add reusable named conditions.
- Conditions can reference other named conditions.

addOperator({ customOperator1, customOperator2, ... })

- Add custom (sync or async) operators.

run(fact, ruleName)

- Executes a given rule against the provided fact

## ⚡ Advanced Usage

- Adding named conditions.
- Adding named operators.
- Rule wise cache disabling.

```javascript
import { Engine } from "@arunkumar_h/rule-engine";

const engineObj = new Engine();

const condition1 = {
  condition1: {
    and: [
      { path: "age", operator: "!==", value: 10 },
      {
        and: [
          { path: "age", operator: ">", value: 15 },
          {
            or: [
              { path: "age", operator: "!==", value: 30 },
              { path: "skills", operator: "includes", value: "ts" },
            ],
          },
        ],
      },
      { path: "language", operator: "in", value: ["tamil", "english"] },
    ],
  },
};
engine.addCondition(condition1); // adding named condition

const rule = {
  testRule: {
    condition: "condition1", // Using named condition
    onSuccess: "Success", //  can be a function or a data
    onFail: "Fail", //  can be a function or a data
    cache: false, // disable cache for this rule
  },
};
engine.addRule(rule);

const fact = { age: 16, skills: ["ts", "php"], language: "tamil" }; // Your data to be validated
const result = await engineObj.run(fact, "testRule");
```

## 🧪 Test Coverage

Badges above represent live coverage stats for:

- [![badge-branches](badges/badge-branches.svg)](badges/badge-branches.svg)
- [![badge-functions](badges/badge-functions.svg)](badges/badge-functions.svg)
- [![badge-lines](badges/badge-lines.svg)](badges/badge-lines.svg)
- [![badge-statements](badges/badge-statements.svg)](badges/badge-statements.svg)

<!-- ## Breaking Change

Due to a breaking change in
the [rule-engine](https://github.com/Arunkumarcs/rule-engine/releases/tag/v3.0.1)
old versions might break when newly installed from `npm`.

- 🔎 Native [JMESPath](https://jmespath.org/)  support for data querying
- 🧰 Built-in caching using [`lru-cache`](https://isaacs.github.io/node-lru-cache/)  for better performance

**Therefore, please move to vv3.0.3 or later.**
 -->

<!-- ## Author

[![LinkedIn](https://img.shields.io/badge/LinkedIn-arunkumar--h-blue?logo=linkedin)](https://www.linkedin.com/in/arunkumar-h-0716b6104)
[![Email](https://img.shields.io/badge/Email-arunkumar.h.in.1991@gmail.com-red?logo=gmail)](mailto:arunkumar.h.in.1991@gmail.com) -->

<!-- [![GitHub](https://img.shields.io/badge/GitHub-Arunkumarcs-black?logo=github)](https://github.com/Arunkumarcs) -->


## Contributors

<a href="https://www.linkedin.com/in/arunkumar-h-0716b6104">
  <img src="https://avatars.githubusercontent.com/Arunkumarcs" width="40" style="border-radius: 50%;" />
</a> <a href="https://github.com/mohanc1989">
  <img src="https://avatars.githubusercontent.com/mohanc1989" width="40" style="border-radius: 50%;" />
</a>


## 📄 License

- **Code**: Licensed under the [MIT License](./LICENSE)

<!-- The detailed list of Open Source dependencies can be found in Fossa report. -->

<!-- [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FArunkumarcs%2Frule-engine.svg?type=large&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2FArunkumarcs%2Frule-engine?ref=badge_large&issueType=license) -->

<!-- ## 🧾 SBOM
A [Software Bill of Materials](./sbom.json) is included to list all open source dependencies and licenses used in this package. -->
