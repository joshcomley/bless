import { ArrayService } from "../array/array.service";

export enum FirstLetterChangeKind {
  NoChange,
  ToLowerCase,
  ToUpperCase,
}
export class StringService {
  public static ChangeFirstLetterCasing(
    input: string,
    kind: FirstLetterChangeKind
  ) {
    return kind === FirstLetterChangeKind.NoChange
      ? input
      : (kind === FirstLetterChangeKind.ToLowerCase
          ? input[0].toLowerCase()
          : input[0].toUpperCase()) + input.substr(1);
  }

  public static FirstLetterToLowerCase(input: string) {
    return `${input[0].toLocaleLowerCase()}${input.substr(1)}`;
  }

  public static FirstLetterToUpperCase(input: string) {
    return `${input[0].toLocaleUpperCase()}${input.substr(1)}`;
  }

  public static IsNullOrWhiteSpace(input: string): boolean {
    if (input == null) {
      return true;
    }
    return input.toString().trim() === "";
  }

  public static JoinAnd(
    values: string[],
    separator: string = ", ",
    and: string = " and "
  ) {
    if (!values || values.length === 0) {
      return "";
    }
    if (values.length === 1) {
      return values[0];
    }
    return [
      values.slice(0, values.length - 1).join(separator),
      values[values.length - 1],
    ].join(and);
  }

  public static KebabCaseToCamelCase(input: string) {
    return input.replace(/-./g, _ => _[1].toUpperCase());
  }

  public static Trim(
    input: string,
    toTrims?: string | string[],
    trimWhitespaceFirst?: boolean
  ): string {
    return this.TrimStart(
      this.TrimEnd(input, toTrims, trimWhitespaceFirst),
      toTrims,
      trimWhitespaceFirst
    );
  }

  public static TrimEnd(
    input: string,
    toTrims?: string | string[],
    trimWhitespaceFist?: boolean
  ): string {
    if (!input) {
      return input;
    }
    toTrims = ArrayService.EnsureArray(toTrims, [null]);
    while (true) {
      let hasChanged = false;
      for (const toTrim of toTrims) {
        if (!toTrim || trimWhitespaceFist) {
          input = input.replace(/\s+$/, "");
        }
        if (!toTrim) {
          continue;
        }
        while (input.endsWith(toTrim)) {
          hasChanged = true;
          input = input.substr(0, input.length - toTrim.length);
        }
      }
      if (!hasChanged) {
        break;
      }
    }
    return input;
  }

  public static CoalesceNullOrWhiteSpace(input: string, value: string) {
    return this.IsNullOrWhiteSpace(input) ? value : input;
  }

  public static TrimStart(
    input: string,
    toTrims?: string | string[],
    trimWhitespaceFist?: boolean
  ): string {
    if (!input) {
      return input;
    }
    toTrims = ArrayService.EnsureArray(toTrims, [null]);
    while (true) {
      let hasChanged = false;
      for (const toTrim of toTrims) {
        if (!toTrim || trimWhitespaceFist) {
          input = input.replace(/^\s+/, "");
        }
        if (!toTrim) {
          continue;
        }
        while (input.startsWith(toTrim)) {
          hasChanged = true;
          input = input.substr(toTrim.length);
        }
      }
      if (!hasChanged) {
        break;
      }
    }
    return input;
  }
}
