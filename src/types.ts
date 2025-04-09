export namespace RuleEngine {
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
    | "in"
    | "!in"
    | "includes"
    | "!includes"
    | string;

  type RuleCallbackMeta = {
    name: string;
    condition: Condition | string;
  };

  type RuleCallback =
    | string
    | number
    | boolean
    | object
    | string[]
    | number[]
    | boolean[]
    | object[]
    | ((fact: object, rule: RuleCallbackMeta) => RuleCallback);

  export interface RuleCondition {
    path: string;
    operator: Operator;
    value: any;
  }

  export type ConditionType = RuleCondition | Condition | string;

  export type ConditionAnd = {
    and: ConditionType[];
  };

  export type ConditionOr = {
    or: ConditionType[];
  };

  export type Condition = ConditionAnd | ConditionOr;

  export type NamedCondition = {
    name: string;
    condition: Condition;
  };

  export type OperatorCallback = (a: any, b: any) => Promise<boolean>;

  export type NamedOperator = {
    name: string;
    operator: OperatorCallback;
  };

  export type Rule = {
    name: string;
    condition: Condition | string;
    onSuccess: RuleCallback;
    onFail: RuleCallback;
    cache?: boolean;
  };
}
