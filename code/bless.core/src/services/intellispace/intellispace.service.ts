export class IntelliSpace {
  public static Format(str: string): string {
    // JC: this is a placeholder for an NPM package I will publish
    if (str == null) {
      return str;
    }
    if (str.length === 0) {
      return "";
    }
    let clone = `${str[0]}`;
    for (let i = 1; i < str.length; i++) {
      const currentChar = str.charCodeAt(i);
      const previousChar = str.charCodeAt(i - 1);
      const currentCharIsTabOrSpace = currentChar === 9 || currentChar === 32;
      const previousCharIsTabOrSpace =
        previousChar === 9 || previousChar === 32;
      if (currentCharIsTabOrSpace && previousCharIsTabOrSpace) {
        continue;
      }
      const currentIsUpperCase = currentChar >= 65 && currentChar <= 90;
      const currentIsLowerCase = currentChar >= 97 && currentChar <= 122;
      const previousIsUpperCase = previousChar >= 65 && previousChar <= 90;
      const previousIsLowerCase = previousChar >= 97 && previousChar <= 122;
      const currentIsNumber = currentChar >= 48 && currentChar <= 57;
      const previousIsNumber = previousChar >= 48 && previousChar <= 57;
      const currentIsAlphaNumeric =
        currentIsUpperCase || currentIsLowerCase || currentIsNumber;
      const previousIsAlphaNumeric =
        previousIsUpperCase || previousIsLowerCase || previousIsNumber;
      const addSpace =
        (currentIsUpperCase && previousIsLowerCase) ||
        (currentIsNumber && !previousIsNumber) ||
        (!currentIsNumber && previousIsNumber) ||
        (currentIsAlphaNumeric && !previousIsAlphaNumeric) ||
        (!currentIsAlphaNumeric && previousIsAlphaNumeric);
      if (addSpace && !currentCharIsTabOrSpace && !previousCharIsTabOrSpace) {
        clone += " ";
      }
      clone += currentCharIsTabOrSpace ? " " : str[i];
    }
    return clone.trim();
  }
}
