import { IntelliSpace } from "./intellispace.service";

describe("IntellispaceService", () => {
  const tests = [
    ["HelloThere", "Hello There"],
    ["Week1Day1", "Week 1 Day 1"],
    ["Week123Day19", "Week 123 Day 19"],
    ["Week::77Day19", "Week :: 77 Day 19"],
    ["No Conversion", "No Conversion"],
    ["Excess 	Spaces", "Excess Spaces"],
    ["B 2", "B 2"],
    [" Excess 	Spaces 2  	", "Excess Spaces 2"],
    [" Excess	Spaces 2  	", "Excess Spaces 2"],
    [" Tabs	ShouldBe		Converted ToSpaces 	", "Tabs Should Be Converted To Spaces"],
    [null, null],
    ["", ""],
    ["  	 		   	", ""],
  ];
  for (const test of tests) {
    it(`should convert "${test[0]}" to "${test[1]}"`, () => {
      expect(IntelliSpace.Format(test[0])).toEqual(test[1]);
    });
  }
});
