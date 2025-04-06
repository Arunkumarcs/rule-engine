import _ from "lodash";
import { RuleMap, RuleCondition } from "./types";

export class RuleEngine {
  private rules: Map<string, any> = new Map();
  private operators: Map<string, any> = new Map();
  private defaultOperators: {
    key: string;
    val: (a: any, b: any) => boolean;
  }[] = [
    {
      key: "%like%",
      val: (a, b) => _.includes(a, b),
    },
    {
      key: "%like",
      val: (a, b) => _.endsWith(a, b),
    },
    {
      key: "like%",
      val: (a, b) => _.startsWith(a, b),
    },
    {
      key: "===",
      val: (a, b) => a === b,
    },
    {
      key: "==",
      val: (a, b) => a == b,
    },
    {
      key: "!==",
      val: (a, b) => a !== b,
    },
    {
      key: "!=",
      val: (a, b) => a != b,
    },
    {
      key: ">",
      val: (a, b) => a > b,
    },
    {
      key: ">=",
      val: (a, b) => a >= b,
    },
    {
      key: "<",
      val: (a, b) => a < b,
    },
    {
      key: "<=",
      val: (a, b) => a <= b,
    },
    {
      key: "in",
      val: (a, b) => Array.isArray(a) && a.includes(b),
    },
  ];

  constructor(rules: RuleMap | {}) {
    this.initial(rules);
  }

  private initial(rules: RuleMap) {
    for (const key in rules) {
      if (Object.prototype.hasOwnProperty.call(rules, key)) {
        let val = rules[key];
        this.rules.set(key, val);
      }
    }

    for (const key of this.defaultOperators) {
      this.operators.set(key.key, key.val);
    }
  }

  private evaluateCondition(
    fact: object,
    { path, operator, value }: RuleCondition
  ): boolean {
    const actual = _.get(fact, path, false);
    const fn = this.operators.get(operator);
    return fn ? fn(actual, value) : false;
  }

  private eventRuleCallback(fact: object) {
    return (cond: any) => {
      if (cond.conditions) {
        return this.evaluateRule(fact, cond);
      } else {
        return this.evaluateCondition(fact, cond);
      }
    };
  }

  private evaluateRule(fact: object, rule: any): boolean {
    const { conditions } = rule;
    if (conditions.all) {
      return conditions.all.every(this.eventRuleCallback(fact));
    }
    if (conditions.any) {
      return conditions.any.some((cond: any) =>
        this.evaluateCondition(fact, cond)
      );
    }
    return false;
  }

  public setOperator(
    symbol: string,
    callback: (a: any, b: any) => boolean
  ): boolean {
    if (!this.operators.has(symbol)) {
      this.operators.set(symbol, callback);
      return true;
    }
    return false;
  }

  public setRule(name: string, rule: object): boolean {
    if (!this.rules.has(name)) {
      this.rules.set(name, rule);
      return true;
    }
    return false;
  }

  public runRule(fact: object, ruleIndex: string): any {
    const rule = this.rules.get(ruleIndex);
    if (this.evaluateRule(fact, rule)) {
      return rule.onSuccess(fact);
    }
    return rule.onFail(fact);
  }
}
