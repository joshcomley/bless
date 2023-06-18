export type FakeObject<T = unknown> = {
  isObjectPathProxy: boolean;
} & {
  [name in keyof T]: FakeObject<T[name]>;
};

export function Path<T>(formatter?: ObjectPathProxyFormatter): FakeObject<T> {
  return new ObjectPathProxy<T>().withObjectPathProxyFormatter(
    formatter
  ) as any;
}

export class ObjectPath<T> {
  public get pathOf(): T {
    return new ObjectPathProxy<T>() as any as T;
  }
}

export type ObjectPathProxyFormatter = (str: string) => string;
export class ObjectPathProxy<T = any> {
  private _objectPathProxyFormatter: ObjectPathProxyFormatter;
  private _propertyName: string = null;

  public get isObjectPathProxy(): boolean {
    return true;
  }

  public get objectPathProxyPropertyName(): string {
    return this._propertyName;
  }

  public get toString() {
    return () => {
      let current: ObjectPathProxy<T> = this;
      const arr = [current];
      while (true) {
        if (current.objectPathProxyParent == null) {
          break;
        }
        current = current.objectPathProxyParent;
        arr.unshift(current);
      }
      let final = arr
        .map(_ => _.objectPathProxyPropertyName)
        .filter(_ => !!_)
        .join(".");
      if (current._objectPathProxyFormatter != null) {
        final = current._objectPathProxyFormatter(final);
      }
      return final;
    };
  }

  constructor(public objectPathProxyParent?: ObjectPathProxy<T>) {
    return new Proxy(this as any as T, {
      get: (obj: any, key: keyof ObjectPathProxy, receiver: any) => {
        if (key === "isObjectPathProxy") {
          return true;
        }
        if (key === "withObjectPathProxyFormatter") {
          return this.withObjectPathProxyFormatter;
        }
        if (key === "objectPathProxyParent") {
          return this.objectPathProxyParent;
        }
        if (key === "objectPathProxyPropertyName") {
          return this.objectPathProxyParent?.objectPathProxyPropertyName;
        }
        if (key === "toString") {
          return this.toString;
        }
        this._propertyName = (key as any).toString();
        return new ObjectPathProxy(this);
      },
    });
  }

  public withObjectPathProxyFormatter(fn: ObjectPathProxyFormatter) {
    this._objectPathProxyFormatter = fn;
    return this;
  }
}
