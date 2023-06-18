export type ArrayOrSingle<T> = T | T[];

export class ArrayService {
  public static OrderByDescending<T, TProp>(
    array: Array<T>,
    sortValue: (item: T) => TProp
  ): Array<T> {
    return this.OrderBy(array, sortValue, true);
  }

  public static OrderBy<T, TProp>(
    array: Array<T>,
    sortValue: (item: T) => TProp,
    descending?: boolean
  ): Array<T> {
    return array.sort((a, b) => {
      const left = sortValue(a);
      const right = sortValue(b);
      if (left > right) {
        return descending ? -1 : 1;
      }
      if (right > left) {
        return descending ? 1 : -1;
      }
      return 0;
    });
  }

  public static AreEquivalent<T>(
    left: ArrayOrSingle<T>,
    right: ArrayOrSingle<T>
  ) {
    left = this.EnsureArray(left);
    right = this.EnsureArray(right);
    if (left.length !== right.length) {
      return false;
    }
    for (const value of left) {
      if (!right.find(_ => _ === value)) {
        return false;
      }
    }
    return true;
  }

  public static Distinct<T>(value: Array<T>): Array<T> {
    return value.filter((v, i, a) => a.indexOf(v) === i);
  }

  public static EnsureArray<T>(value: ArrayOrSingle<T>, ifNull?: Array<T>) {
    if (value == null) {
      return ifNull === undefined ? [] : ifNull;
    }
    if (!Array.isArray(value)) {
      return [value];
    }
    return value;
  }

  public static First<T>(value: Array<T>) {
    if (!value) {
      throw Error("Array is null or undefined");
    }
    if (!value[0]) {
      throw Error("Array is empty");
    }
  }

  public static FirstOrDefault<T>(value: Array<T>) {
    if (!value && !value[0]) {
      return null;
    }
    return value[0];
  }

  public static Repeat<T>(value: T, count: number): Array<T> {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(value);
    }
    return arr;
  }
}
