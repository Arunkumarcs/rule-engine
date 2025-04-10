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
interface ConditionGroup {
  all?: Rule[];
  any?: Rule[];
}

// A rule is either a condition or a group of conditions
type Rule = RuleCondition | ConditionGroup;

// Full rule engine definition
interface RuleSet {
  conditions: ConditionGroup;
  onSuccess?: () => void;
  onFail?: () => void;
}

// Full rule engine definition
export interface RuleMap {
  [k: string]: RuleSet;
}

// Basic condition
export interface RuleCondition {
  path: string;
  operator: Operator;
  value: any;
}
