import { N_Engine } from "./types";
import { get, defaultOperators, memoize, typeGuardCondition } from "./helper";
import { LRUCache } from "lru-cache";

export {
  includes,
  endsWith,
  startsWith,
  get,
  memoize,
  typeGuardCondition,
} from "./helper";


class Engine {
  protected namedRules: Map<string, N_Engine.Rule> = new Map();
  protected namedConditions: Map<string, N_Engine.Condition> = new Map();
  protected namedOperators: Map<string, N_Engine.OperatorCallback> = new Map(
    Object.entries(defaultOperators)
  );
  protected cache: LRUCache<string, boolean> | null = null;
  protected cacheOption: LRUCache.Options<string, boolean, unknown> = {
    max: 500,
    ttl: 1000 * 60 * 5,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
    // maxSize: 5000,

    // for use with tracking overall storage size
    // sizeCalculation: (value, key) => {
    //   return 1;
    // },

    // for use when you need to clean up something when objects
    // are evicted from the cache
    // dispose: (value, key, reason) => {
    // freeFromMemoryOrWhatever(value);
    // },

    // for use when you need to know that an item is being inserted
    // note that this does NOT allow you to prevent the insertion,
    // it just allows you to know about it.
    // onInsert: (value: any, key: any, reason: any) => {},

    // async method to use for cache.fetch(), for
    // stale-while-revalidate type of behavior
    // fetchMethod: async (key, staleValue, { options, signal, context }) => {},
  };

  constructor(
    cacheOptions: Partial<LRUCache.Options<string, boolean, unknown>> = {}
  ) {
    this.cache = new LRUCache({
      ...this.cacheOption,
      ...cacheOptions,
    });
  }

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

  protected async executeOperation(
    fact: object,
    { path, operator, value }: N_Engine.ConditionOperation
  ): Promise<boolean> {
    const actual = get(fact, path);

    const fn = this.namedOperators.get(operator);

    if (!fn) {
      throw new Error(`Operator "${operator}" not found`);
    }

    return fn(actual, value);
  }

  protected async executeConditionOperation(
    fact: object,
    cond: N_Engine.ConditionType
  ) {
    if (typeof cond === "string" || "and" in cond || "or" in cond) {
      return this.evaluateRule(fact, cond);
    } else if ("operator" in cond) {
      return this.executeOperation(fact, cond);
    }
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

    if (typeGuardCondition(namedCondition)) {
      if ("and" in namedCondition) {
        return (
          await Promise.all(
            namedCondition.and.map(async (cond: N_Engine.ConditionType) =>
              this.executeConditionOperation(fact, cond)
            )
          )
        ).every((result) => result);
      } else {
        return (
          await Promise.all(
            namedCondition.or.map(async (cond: N_Engine.ConditionType) =>
              this.executeConditionOperation(fact, cond)
            )
          )
        ).some((result) => result);
      }
    }
    throw new Error(`Condition "${JSON.stringify(condition)}" is not valid`);
  }

  protected async memoize(resolver: (...args: any[]) => string) {
    const self = this;
    return async function (...args: any[]) {
      const key = await resolver(...args);

      if (self.cache && self.cache.has(key)) {
        return self.cache.get(key);
      }

      const result = await self.evaluateRule(args[0], args[1]);

      if (self.cache) {
        self.cache.set(key, result);
      }
      return result;
    };
  }

  protected async cachedEvaluateRule(ruleName: string, rule: N_Engine.Rule) {
    const cacheMethod = rule.cache ?? true;

    if (cacheMethod === false) {
      return this.evaluateRule;
    }

    // TODO: Provision for custom cache key
    return this.memoize(
      (fact: object) => `${ruleName}-${JSON.stringify(fact)}`
    );
  }

  public async run(fact: object, ruleName: string) {
    const rule = this.namedRules.get(ruleName) as N_Engine.Rule;

    if (!rule) {
      throw new Error(`Rule "${ruleName}" not found`);
    }
    const resultCallback = await this.cachedEvaluateRule(ruleName, rule);
    const result = await Reflect.apply(resultCallback, this, [
      fact,
      rule.condition,
    ]);

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
