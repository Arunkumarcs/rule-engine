import includes from "lodash.includes";
import endsWith from "lodash.endswith";
import startsWith from "lodash.startswith";
import { N_Engine } from "./types";

class Engine {
  protected namedRules: Map<string, N_Engine.Rule> = new Map();
  protected namedConditions: Map<string, N_Engine.Condition> = new Map();
  protected namedOperators: Map<string, N_Engine.OperatorCallback> = new Map(
    [
      {
        key: "%like%",
        val: async (a: any, b: any) => Promise.resolve(includes(a, b)),
      },
      {
        key: "%like",
        val: async (a: any, b: any) => Promise.resolve(endsWith(a, b)),
      },
      {
        key: "like%",
        val: async (a: any, b: any) => Promise.resolve(startsWith(a, b)),
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

  addRule(list: N_Engine.NamedRules) {
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.add(key, list[key]);
      }
    }
  }

  addCondition(list: N_Engine.NamedConditions) {
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.add(key, list[key]);
      }
    }
  }

  addOperator(list: N_Engine.NamedOperators) {
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.add(key, list[key]);
      }
    }
  }
}

export default Engine;
