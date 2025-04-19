import { search } from "jmespath";
import { N_Engine } from "./types";

export function typeGuardCondition(
  condition: object
): condition is N_Engine.ConditionAnd | N_Engine.ConditionOr {
  return (
    typeof condition === "object" && ("and" in condition || "or" in condition)
  );
}
  
export function memoize(
  fn: (...args: any[]) => any,
  resolver: (...args: any[]) => string = (...args: any[]) =>
    JSON.stringify(args)
) {
  const cache = new Map();

  return function (...args: any[]) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function includes(collection: unknown, value: any) {
  if (typeof collection === "string") {
    return collection.includes(value);
  }

  if (Array.isArray(collection)) {
    return collection.indexOf(value) !== -1;
  }

  if (typeof collection === "object" && collection !== null) {
    return Object.values(collection).includes(value);
  }

  return false;
}

export function endsWith(str: string, target: string, position?: number) {
  if (typeof str !== "string" || typeof target !== "string") return false;

  const len =
    position !== undefined ? Math.min(position, str.length) : str.length;

  return str.slice(0, len).endsWith(target);
}

export function startsWith(str: string, target: string, position?: number) {
  if (typeof str !== "string" || typeof target !== "string") return false;

  const len =
    position !== undefined ? Math.min(position, str.length) : str.length;

  return str.slice(0, len).startsWith(target);
}

export function get(fact: object, path: string) {
  return search(fact, path);
}

export const defaultOperators = {
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
