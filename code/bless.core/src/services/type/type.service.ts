import { Type } from "@bless/core";

export class TypeService<T = any> {
  public get object(): T {
    return typeof this.source === "function" ? null : this.source;
  }

  public get propertiesAndFields(): string[] {
    const properties = Object.getOwnPropertyDescriptors(this.type);
    const fields = this.source ? Object.keys(this.source) : [];
    const all = new Array<string>();
    for (const property in properties) {
      if (property !== "constructor") {
        all.push(property);
      }
    }
    all.push(...fields);
    return [...new Set(all)];
  }

  public get type(): Type<T> {
    return typeof this.source === "function"
      ? this.source.prototype
      : this.source.constructor.prototype;
  }

  constructor(private source: T | Type<T>) {}
}
