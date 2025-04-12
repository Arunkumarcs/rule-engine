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
    | "!includes";

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

  type ConditionName = string;

  export type OperatorCallback = (a: any, b: any) => Promise<boolean>;

  type ConditionOperation = {
    path: string;
    operator: Operator;
    value: any;
  };

  type ConditionType = ConditionOperation | Condition | ConditionName;

  export type Condition =
    | { and: ConditionType[]; or?: never }
    | { or: ConditionType[]; and?: never };

  export type Rule = {
    condition: Condition | ConditionName;
    onSuccess: RuleCallback;
    onFail: RuleCallback;
  };
  export type NamedRules = Record<string, Rule>;
  export type NamedConditions = Record<string, Condition>;
  export type NamedOperators = Record<string, OperatorCallback>;
}
