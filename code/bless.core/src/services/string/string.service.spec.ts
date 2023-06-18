import { StringService } from "./string.service";

describe("StringService", () => {
  beforeEach(() => {});

  it("Trim with multiple strings should work", () => {
    const str = "defabcdefdefd";
    expect(StringService.Trim(str, ["f", "d"])).toBe("efabcdefde");
  });

  // it("TrimEnd should have no effect if toTrim isn't in the string", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.TrimEnd(str, "hij")).toBe(str);
  // });

  // it("TrimEnd should work", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.TrimEnd(str, "def")).toBe("defabc");
  // });

  // it("TrimEnd with trimWhitespaceFirst should work", () => {
  //   const str = "   defabcdefdef.  ";
  //   expect(StringService.TrimEnd(str, ".", true)).toBe("   defabcdefdef");
  // });

  // it("TrimStart with trimWhitespaceFirst should work", () => {
  //   const str = "   :defabcdefdef  ";
  //   expect(StringService.TrimStart(str, ":", true)).toBe("defabcdefdef  ");
  // });

  // it("TrimStart with no trim value should trim trailing whitespace", () => {
  //   const str = "     defabcdefdef      ";
  //   expect(StringService.TrimStart(str)).toBe("defabcdefdef      ");
  // });

  // it("TrimEnd with no trim value should trim trailing whitespace", () => {
  //   const str = "     defabcdefdef      ";
  //   expect(StringService.TrimEnd(str)).toBe("     defabcdefdef");
  // });

  // it("TrimStart have no effect if toTrim isn't in the string", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.TrimStart(str, "hij")).toBe(str);
  // });

  // it("TrimStart work", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.TrimStart(str, "def")).toBe("abcdefdef");
  // });

  // it("Trim should have no effect if toTrim isn't in the string", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.Trim(str, "hij")).toBe(str);
  // });

  // it("Trim should work", () => {
  //   const str = "defabcdefdef";
  //   expect(StringService.Trim(str, "def")).toBe("abc");
  // });
});
