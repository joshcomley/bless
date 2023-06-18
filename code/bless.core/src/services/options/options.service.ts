import { TypeService } from "../type/type.service";

export class OptionsService<T> {
  private providers = new Array<T>();

  constructor() {}

  public addProviders(...providers: T[]): OptionsService<T> {
    this.providers.push(...providers);
    return this;
  }

  public build(): T {
    const result = {} as T;
    for (const provider of this.providers) {
      if (provider == null) {
        continue;
      }
      const properties = new TypeService(provider).propertiesAndFields;
      for (const prop of properties) {
        if (result[prop] != null) {
          continue;
        }
        const value = provider[prop];
        if (value != null) {
          result[prop] = value;
        }
      }
    }
    return result;
  }

  public first<TProperty>(fn: (arg?: T) => TProperty): TProperty {
    for (const provider of this.providers) {
      const value = fn(provider);
      if (value != null) {
        return value;
      }
    }
    return null;
  }
}
