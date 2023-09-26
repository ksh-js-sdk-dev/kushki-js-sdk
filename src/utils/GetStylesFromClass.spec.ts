import { getStylesFromClass } from "utils/GetStylesFromClass.ts";

describe("Test getStylesFromClass", function () {
  beforeEach(() => {
    const style = document.createElement("style");

    document.head.appendChild(style);
    style.sheet?.insertRule(".test { color: red; } ");
  });

  test("should return object with style of class css", () => {
    const style = getStylesFromClass(".test");

    expect(style.color).toEqual("red");
  });
});
