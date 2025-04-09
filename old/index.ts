import _ from "lodash";
import { RuleMap, RuleSet, RuleCondition, ConditionGroup } from "./types";

export class RuleEngine {
  private rules: Map<string, RuleSet> = new Map();
  private operators: Map<string, (a: any, b: any) => Promise<boolean>> =
    new Map();
  private defaultOperators: {
    key: string;
    val: (a: any, b: any) => Promise<boolean>;
  }[] = [
    {
      key: "%like%",
      val: (a, b) => Promise.resolve(_.includes(a, b)),
    },
    {
      key: "%like",
      val: (a, b) => Promise.resolve(_.endsWith(a, b)),
    },
    {
      key: "like%",
      val: (a, b) => Promise.resolve(_.startsWith(a, b)),
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

  constructor(rules?: RuleMap) {
    this.initial(rules);
  }

  private initial(rules?: RuleMap) {
    if (rules) {
      this.rules = new Map<string, RuleSet>(
        rules.map((rule) => [rule.name, rule])
      );
    }

    this.defaultOperators.forEach((op) => this.operators.set(op.key, op.val));
  }

  private async evaluateCondition(
    fact: object,
    { path, operator, value }: RuleCondition
  ): Promise<boolean> {
    const actual = _.get(fact, path, false);
    const fn = this.operators.get(operator);

    if (!fn) {
      throw new Error(`Operator "${operator}" not found`);
    }

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

  private async evaluateRule(
    fact: object,
    conditionGroup: ConditionGroup
  ): Promise<boolean> {
    if (conditionGroup.all) {
      return (
        await Promise.all(conditionGroup.all.map(this.eventRuleCallback(fact)))
      ).every((result) => result);
    }
    if (conditionGroup.any) {
      return (
        await Promise.all(
          conditionGroup.any.map(
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

  public async setRule(name: string, rule: RuleSet): Promise<boolean> {
    if (!this.rules.has(name)) {
      this.rules.set(name, rule);
      return true;
    }
    return false;
  }

  private async memorizedEvaluateRule(
    keyFunction?: (fact: object, conditions: ConditionGroup) => string | boolean
  ) {
    return typeof keyFunction === "function"
      ? _.memoize(this.evaluateRule, keyFunction)
      : _.memoize(this.evaluateRule);
  }

  public async runRule(fact: object, ruleIndex: string): Promise<any> {
    const rule = this.rules.get(ruleIndex) as RuleSet;

    if (!rule) {
      throw new Error(`Rule "${ruleIndex}" not found`);
    }

    let result;
    if (rule.memorizeKey) {
      result = await (
        await this.memorizedEvaluateRule(rule.memorizeKey)
      )(fact, rule.conditions);
    } else {
      result = await this.evaluateRule(fact, rule.conditions);
    }

    if (result) {
      if (typeof rule.onSuccess === "function") {
        return rule.onSuccess(fact, {
          name: rule.name,
          conditions: rule.conditions,
        });
      } else {
        return rule.onSuccess;
      }
    }

    if (typeof rule.onFail === "function") {
      return rule.onFail(fact, {
        name: rule.name,
        conditions: rule.conditions,
      });
    } else {
      return rule.onFail;
    }
  }
}
