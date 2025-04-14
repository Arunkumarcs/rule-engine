import { JSONPath } from "jsonpath-plus";

export function memoize(
  fn: (...args: any[]) => any,
  resolver = (...args: any[]) => JSON.stringify(args)
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
  return JSONPath({
    path,
    json: fact,
    resultType: "value",
    ignoreEvalErrors: true,
  });
}
