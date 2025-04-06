```

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

```
