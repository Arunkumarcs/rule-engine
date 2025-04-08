// Primitive operators
type Operator =
  | "==="
  | "!=="
  | ">"
  | ">="
  | "<"
  | "<="
  | "=="
  | "!="
  | "like%"
  | "%like"
  | "%like%"
  | string;

// Nested group of conditions (supports recursion)
export interface ConditionGroup {
  all?: Rule[];
  any?: Rule[];
}

// A rule is either a condition or a group of conditions
type Rule = RuleCondition | ConditionGroup;

type RuleCallback =
  | string
  | number
  | boolean
  | object
  | string[]
  | number[]
  | boolean[]
  | object[]
  | ((
      fact: object,
      rule: {
        name: string;
        conditions: ConditionGroup;
      }
    ) =>
      | string
      | number
      | boolean
      | object
      | string[]
      | number[]
      | boolean[]
      | object[]);

// Full rule engine definition
export interface RuleSet {
  name: string;
  conditions: ConditionGroup;
  onSuccess?: RuleCallback;
  onFail?: RuleCallback;
  memorizeKey?: (fact: object, conditions: ConditionGroup) => string | boolean;
}

// Full rule engine definition
export type RuleMap = RuleSet[];


// Basic condition
export interface RuleCondition {
  path: string;
  operator: Operator;
  value: any;
}
