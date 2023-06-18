import { IntelliSpace } from "../intellispace";
import {
  ObjectPath,
  ObjectPathProxy,
} from "../path-builder/path-builder.service";
export declare type PathLambda<T = any, TResult = any> =
  | ((arg: T) => TResult)
  | (() => TResult)
  | ObjectPath<T>
  | string
  | null
  | undefined;

const _nameOf: any = {};
export function nameof<T>(
  fn: PathLambda<T, any>,
  intellispace?: boolean
): string {
  if (fn == null) {
    return "";
  }
  if (typeof fn === "string") {
    return fn;
  }
  if (fn instanceof ObjectPathProxy) {
    return fn.objectPathProxyPropertyName;
  }
  let fnStr = `${fn.toString()}-${intellispace}`;
  if (!_nameOf[fnStr]) {
    // Strip new lines
    fnStr = fnStr.replace(/(\r\n|\n|\r)/gm, "");
    // Cater for ES5: "function () { return someClass; }"
    fnStr =
      fnStr.replace(
        /^\s*function\s*\(\s*\)\s*\{\s*return\s*(.*)\s*;\s*\}\s*$/,
        "$1"
      ) || fnStr;
    const dot = fnStr.lastIndexOf(".");
    const str = fnStr.substr(dot + 1);
    const result = /[A-Za-z_][A-Za-z0-9_]+/.exec(str)?.[0];
    _nameOf[fnStr] = intellispace ? IntelliSpace.Format(result ?? "") : result;
  }
  return _nameOf[fnStr];
}
