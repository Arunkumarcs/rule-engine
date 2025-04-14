import { N_Engine } from "./types";
import memoize from "lodash.memoize";
import { includes, endsWith, startsWith, get } from "./helper";

const defaultOperators = {
  "%like%": async (a: string, b: string) => includes(a, b),
  "%like": async (a: string, b: string) => endsWith(a, b),
  "like%": async (a: string, b: string) => startsWith(a, b),
  "===": async (a: any, b: any) => a === b,
  "==": async (a: any, b: any) => a == b,
  "!==": async (a: any, b: any) => a !== b,
  "!=": async (a: any, b: any) => a != b,
  ">": async (a: any, b: any) => a > b,
  ">=": async (a: any, b: any) => a >= b,
  "<": async (a: any, b: any) => a < b,
  "<=": async (a: any, b: any) => a <= b,
  in: async (a: any, b: any[]) => includes(b, a),
  "!in": async (a: any, b: any[]) => !includes(b, a),
  includes: async (a: any[], b: any) => includes(a, b),
};

class Engine {
  protected namedRules: Map<string, N_Engine.Rule> = new Map();
  protected namedConditions: Map<string, N_Engine.Condition> = new Map();
  protected namedOperators: Map<string, N_Engine.OperatorCallback> = new Map(
    Object.entries(defaultOperators)
  );

  get rule() {
    return Object.fromEntries(this.namedRules);
  }

  get condition() {
    return Object.fromEntries(this.namedConditions);
  }

  get operator() {
    return Object.fromEntries(this.namedOperators);
  }

  private add(
    key: string,
    data: N_Engine.Rule | N_Engine.Condition | N_Engine.OperatorCallback
  ) {
    if ("condition" in data) {
      if (this.namedRules.has(key)) {
        throw new Error(`Rule ${key} already exists`);
      }
      this.namedRules.set(key, data);
    } else if ("and" in data || "or" in data) {
      if (this.namedConditions.has(key)) {
        throw new Error(`Condition ${key} already exists`);
      }
      this.namedConditions.set(key, data);
    } else if (typeof data === "function") {
      if (this.namedOperators.has(key)) {
        throw new Error(`Operator ${key} already exists`);
      }
      this.namedOperators.set(key, data);
    } else {
      throw new Error(`Invalid data type: ${typeof data}`);
    }
  }

  private addLoop(
    list:
      | N_Engine.NamedRules
      | N_Engine.NamedConditions
      | N_Engine.NamedOperators
  ) {
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.add(key, list[key]);
      }
    }
  }

  public addRule(list: N_Engine.NamedRules) {
    this.addLoop(list);
  }

  public addCondition(list: N_Engine.NamedConditions) {
    this.addLoop(list);
  }

  public addOperator(list: N_Engine.NamedOperators) {
    this.addLoop(list);
  }

  protected async doOperation(
    fact: object,
    { path, operator, value }: N_Engine.ConditionOperation
  ): Promise<boolean> {
    // TODO: optimize
    const actual = get(fact, path);

    const fn = this.namedOperators.get(operator);

    if (!fn) {
      throw new Error(`Operator "${operator}" not found`);
    }

    return fn(actual, value);
  }

  protected async evaluateConditionOperation(
    fact: object,
    cond: N_Engine.ConditionType
  ) {
    if (typeof cond === "string" || "and" in cond || "or" in cond) {
      return this.evaluateRule(fact, cond);
    } else if ("operator" in cond) {
      return this.doOperation(fact, cond);
    }
  }

  protected guardCondition(
    condition: object
  ): condition is N_Engine.ConditionAnd | N_Engine.ConditionOr {
    return (
      typeof condition === "object" && ("and" in condition || "or" in condition)
    );
  }

  protected async evaluateRule(
    fact: object,
    condition: N_Engine.Condition | string
  ): Promise<boolean> {
    let namedCondition: unknown;
    if (typeof condition === "string") {
      namedCondition = this.namedConditions.get(condition);
    } else {
      namedCondition = condition;
    }

    if (!namedCondition) {
      throw new Error(`Condition "${condition}" not found`);
    }

    if (this.guardCondition(namedCondition) && "and" in namedCondition) {
      return (
        await Promise.all(
          namedCondition.and.map(async (cond: N_Engine.ConditionType) =>
            this.evaluateConditionOperation(fact, cond)
          )
        )
      ).every((result) => result);
    }
    if (this.guardCondition(namedCondition) && "or" in namedCondition) {
      return (
        await Promise.all(
          namedCondition.or.map(async (cond: N_Engine.ConditionType) =>
            this.evaluateConditionOperation(fact, cond)
          )
        )
      ).some((result) => result);
    }
    return false;
  }

  protected async cachedRuleEvaluate(ruleName: string, rule: N_Engine.Rule) {
    const cacheMethod = rule.cache ?? true;

    if (cacheMethod === false) {
      return this.evaluateRule;
    }

    const methodToCache = this.evaluateRule;

    // TODO: Provision for custom cache key
    return memoize(
      methodToCache,
      (fact: object) => `${ruleName}-${JSON.stringify(fact)}`
    );
  }

  public async run(fact: object, ruleName: string) {
    const rule = this.namedRules.get(ruleName) as N_Engine.Rule;

    if (!rule) {
      throw new Error(`Rule "${ruleName}" not found`);
    }

    const result = await (
      await this.cachedRuleEvaluate(ruleName, rule)
    )(fact, rule.condition);

    if (result) {
      if (typeof rule.onSuccess === "function") {
        return rule.onSuccess(fact, ruleName);
      } else {
        return rule.onSuccess;
      }
    }
    if (typeof rule.onFail === "function") {
      return rule.onFail(fact, ruleName);
    } else {
      return rule.onFail;
    }
  }
}

export default Engine;
