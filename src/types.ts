export namespace N_Engine {
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

  type RuleCallback =
    | string
    | number
    | boolean
    | object
    | string[]
    | number[]
    | boolean[]
    | object[]
    | ((fact: object, name: string) => RuleCallback);

  export type OperatorCallback = (a: any, b: any) => Promise<boolean> | boolean;

  export type ConditionOperation = {
    path: string;
    operator: Operator;
    value: any;
  };

  export type ConditionType = ConditionOperation | Condition | string;

  export type ConditionAnd = { and: ConditionType[] };
  export type ConditionOr = { or: ConditionType[] };
  export type Condition = ConditionAnd | ConditionOr;

  export type Rule = {
    condition: Condition | string;
    onSuccess: RuleCallback;
    onFail: RuleCallback;
    cache?: boolean;
  };
  export type NamedRules = Record<string, Rule>;
  export type NamedConditions = Record<string, Condition>;
  export type NamedOperators = Record<string, OperatorCallback>;
}
