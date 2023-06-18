import { PathLambda } from "../nameof";
import { ObjectPathProxy } from "../path-builder/path-builder.service";

const _pathOf = {} as any;
export function pathof<T>(fn: PathLambda<T>): string {
  if (fn == null) {
    return "";
  }
  if (typeof fn === "string") {
    return fn;
  }
  if (fn instanceof ObjectPathProxy) {
    return fn.toString();
  }
  const fnStr = fn.toString();
  // console.log('PATHOF: ' + fnStr);
  if (!_pathOf[fnStr]) {
    const rtn = fnStr.indexOf("return ");
    let str = fnStr;
    if (rtn !== -1) {
      str = str.substr(rtn + 1);
    }
    const dot = str.indexOf(".");
    str = str.substr(dot + 1);
    const result = /[A-Za-z_][A-Za-z0-9_.[\]]+/.exec(str)?.[0];
    // console.log('PATHOF RESULT: ' + result);
    _pathOf[fnStr] = result;
  }
  return _pathOf[fnStr];
}
