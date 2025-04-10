import get from "lodash.get";
import includes from "lodash.includes";
import startsWith from "lodash.startswith";
import endsWith from "lodash.endswith";
import { RuleMap, RuleCondition } from "./types";

export class RuleEngine {
  private rules: Map<string, any> = new Map();
  private operators: Map<string, any> = new Map();
  private defaultOperators: {
    key: string;
    val: (a: any, b: any) => Promise<boolean>;
  }[] = [
    {
      key: "%like%",
      val: (a, b) => Promise.resolve(includes(a, b)),
    },
    {
      key: "%like",
      val: (a, b) => Promise.resolve(endsWith(a, b)),
    },
    {
      key: "like%",
      val: (a, b) => Promise.resolve(startsWith(a, b)),
    },
    {
      key: "===",
      val: (a, b) => Promise.resolve(a === b),
    },
    {
      key: "==",
      val: (a, b) => Promise.resolve(a == b),
    },
    {
      key: "!==",
      val: (a, b) => Promise.resolve(a !== b),
    },
    {
      key: "!=",
      val: (a, b) => Promise.resolve(a != b),
    },
    {
      key: ">",
      val: (a, b) => Promise.resolve(a > b),
    },
    {
      key: ">=",
      val: (a, b) => Promise.resolve(a >= b),
    },
    {
      key: "<",
      val: (a, b) => Promise.resolve(a < b),
    },
    {
      key: "<=",
      val: (a, b) => Promise.resolve(a <= b),
    },
    {
      key: "in",
      val: (a, b) => Promise.resolve(Array.isArray(a) && a.includes(b)),
    },
  ];

  constructor(rules: RuleMap | {}) {
    this.initial(rules);
  }

  private initial(rules: RuleMap) {
    this.rules = new Map(Object.entries(rules));
    this.defaultOperators.forEach((op) => this.operators.set(op.key, op.val));
  }

  private async evaluateCondition(
    fact: object,
    { path, operator, value }: RuleCondition
  ): Promise<boolean> {
    const actual = get(fact, path, false);
    const fn = this.operators.get(operator);
    return fn ? await fn(actual, value) : Promise.resolve(false);
  }

  private eventRuleCallback(fact: object) {
    return async (cond: any) => {
      if (cond.all || cond.any) {
        return this.evaluateRule(fact, cond);
      } else {
        return this.evaluateCondition(fact, cond);
      }
    };
  }

  private async evaluateRule(fact: object, rule: any): Promise<boolean> {
    if (rule.all) {
      return (
        await Promise.all(rule.all.map(this.eventRuleCallback(fact)))
      ).every((result) => result);
    }
    if (rule.any) {
      return (
        await Promise.all(
          rule.any.map(
            async (cond: any) => await this.evaluateCondition(fact, cond)
          )
        )
      ).some((result) => result);
    }
    return false;
  }

  public async setOperator(
    symbol: string,
    callback: (a: any, b: any) => Promise<boolean>
  ): Promise<boolean> {
    if (!this.operators.has(symbol)) {
      this.operators.set(symbol, callback);
      return true;
    }
    return false;
  }

  public async setRule(name: string, rule: object): Promise<boolean> {
    if (!this.rules.has(name)) {
      this.rules.set(name, rule);
      return true;
    }
    return false;
  }

  public async runRule(fact: object, ruleIndex: string): Promise<any> {
    const rule = this.rules.get(ruleIndex);
    const result = await this.evaluateRule(fact, rule.conditions);
    if (result) {
      return rule.onSuccess(fact);
    }
    return rule.onFail(fact);
  }
}
