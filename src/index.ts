import { RuleEngine } from "./types";
import { get, memoize, includes, startsWith, endsWith, isArray } from "lodash";

export class Engine {
  protected namedRules: Map<string, RuleEngine.Rule> = new Map();
  protected namedConditions: Map<string, RuleEngine.Condition> = new Map();
  protected namedOperators: Map<string, RuleEngine.OperatorCallback> = new Map(
    [
      {
        key: "%like%",
        val: async (a: string, b: string) => Promise.resolve(includes(a, b)),
      },
      {
        key: "%like",
        val: async (a: string, b: string) => Promise.resolve(endsWith(a, b)),
      },
      {
        key: "like%",
        val: async (a: string, b: string) => Promise.resolve(startsWith(a, b)),
      },
      {
        key: "===",
        val: async (a: any, b: any) => Promise.resolve(a === b),
      },
      {
        key: "==",
        val: async (a: any, b: any) => Promise.resolve(a == b),
      },
      {
        key: "!==",
        val: async (a: any, b: any) => Promise.resolve(a !== b),
      },
      {
        key: "!=",
        val: async (a: any, b: any) => Promise.resolve(a != b),
      },
      {
        key: ">",
        val: async (a: any, b: any) => Promise.resolve(a > b),
      },
      {
        key: ">=",
        val: async (a: any, b: any) => Promise.resolve(a >= b),
      },
      {
        key: "<",
        val: async (a: any, b: any) => Promise.resolve(a < b),
      },
      {
        key: "<=",
        val: async (a: any, b: any) => Promise.resolve(a <= b),
      },
      {
        key: "in",
        val: async (a: any, b: any) => Promise.resolve(includes(b, a)),
      },
      {
        key: "!in",
        val: async (a: any, b: any) => Promise.resolve(!includes(b, a)),
      },
      {
        key: "includes",
        val: async (a: any, b: any) => Promise.resolve(includes(a, b)),
      },
      {
        key: "!includes",
        val: async (a: any, b: any) => Promise.resolve(!includes(a, b)),
      },
    ].map((data) => [data.key, data.val])
  );

  get rule() {
    return Object.fromEntries(this.namedRules);
  }

  addRule(list: RuleEngine.Rule | RuleEngine.Rule[]) {
    if (isArray(list)) {
      list.forEach((data) => {
        if (this.namedRules.has(data.name)) {
          throw new Error(`Rule ${data.name} already exists`);
        }
        return this.namedRules.set(data.name, data);
      });
    } else {
      if (this.namedRules.has(list.name)) {
        throw new Error(`Rule ${list.name} already exists`);
      }
      this.namedRules.set(list.name, list);
    }
  }

  get conditions() {
    return Object.fromEntries(this.namedConditions);
  }

  addCondition(list: RuleEngine.NamedCondition | RuleEngine.NamedCondition[]) {
    if (isArray(list)) {
      list.forEach((data) => {
        if (this.namedConditions.has(data.name)) {
          throw new Error(`Condition ${data.name} already exists`);
        }
        return this.namedConditions.set(data.name, data.condition);
      });
    } else {
      if (this.namedConditions.has(list.name)) {
        throw new Error(`Condition ${list.name} already exists`);
      }
      this.namedConditions.set(list.name, list.condition);
    }
  }

  get operators() {
    return Object.fromEntries(this.namedOperators);
  }

  addOperator(list: RuleEngine.NamedOperator | RuleEngine.NamedOperator[]) {
    if (isArray(list)) {
      list.forEach((data) => {
        if (this.namedOperators.has(data.name)) {
          throw new Error(`Operator ${data.name} already exists`);
        }
        return this.namedOperators.set(data.name, data.operator);
      });
    } else {
      if (this.namedOperators.has(list.name)) {
        throw new Error(`Operator ${list.name} already exists`);
      }
      this.namedOperators.set(list.name, list.operator);
    }
  }

  protected async evaluateCondition(
    fact: object,
    { path, operator, value }: RuleEngine.RuleCondition
  ): Promise<boolean> {
    const actual = get(fact, path, false);
    const fn = this.namedOperators.get(operator);

    if (!fn) {
      throw new Error(`Operator "${operator}" not found`);
    }

    return fn(actual, value);
  }

  protected async evaluateRuleCondition(
    fact: object,
    cond: RuleEngine.ConditionType
  ) {
    if (typeof cond === "string" || "and" in cond || "or" in cond) {
      return this.evaluateRule(fact, cond);
    } else if ("operator" in cond) {
      return this.evaluateCondition(fact, cond);
    }
  }

  protected async evaluateRule(
    fact: object,
    condition: RuleEngine.Condition | string
  ): Promise<any> {
    let namedCondition: RuleEngine.Condition | undefined;
    if (typeof condition === "string") {
      namedCondition = this.namedConditions.get(condition);
    } else {
      namedCondition = condition;
    }

    if (!namedCondition) {
      throw new Error(`Condition "${condition}" not found`);
    }

    if ("and" in namedCondition) {
      return (
        await Promise.all(
          namedCondition.and.map(async (cond: RuleEngine.ConditionType) =>
            this.evaluateRuleCondition(fact, cond)
          )
        )
      ).every((result) => result);
    }
    if ("or" in namedCondition) {
      return (
        await Promise.all(
          namedCondition.or.map(async (cond: RuleEngine.ConditionType) =>
            this.evaluateRuleCondition(fact, cond)
          )
        )
      ).some((result) => result);
    }
  }

  protected async cachedRuleEvaluate(rule: RuleEngine.Rule) {
    const cacheMethod = get(rule, "cache", true);

    if (cacheMethod === false) {
      return async (fact: object) => this.evaluateRule(fact, rule.condition);
    }

    const methodToCache = async (
      fact: object,
      condition: RuleEngine.Condition | string
    ) => {
      return this.evaluateRule(fact, condition);
    };

    // TODO: Provision for custom cache key
    if (typeof cacheMethod === "string") {
      return memoize(
        methodToCache,
        (fact: object, condition: RuleEngine.Condition | string) =>
          `${rule.name}-${get(fact, cacheMethod)}`
      );
    }

    return memoize(
      methodToCache,
      (fact: object, condition: RuleEngine.Condition | string) =>
        `${rule.name}-${JSON.stringify(fact)}`
    );
  }

  public async run(fact: object, ruleName: string) {
    const rule = this.namedRules.get(ruleName) as RuleEngine.Rule;

    if (!rule) {
      throw new Error(`Rule "${ruleName}" not found`);
    }

    const result = await (
      await this.cachedRuleEvaluate(rule)
    )(fact, rule.condition);

    if (result) {
      if (typeof rule.onSuccess === "function") {
        return rule.onSuccess(fact, {
          name: rule.name,
          condition: rule.condition,
        });
      } else {
        return rule.onSuccess;
      }
    }

    if (typeof rule.onFail === "function") {
      return rule.onFail(fact, {
        name: rule.name,
        condition: rule.condition,
      });
    } else {
      return rule.onFail;
    }
  }
}
