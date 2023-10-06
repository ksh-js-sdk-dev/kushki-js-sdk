import {
  buildCssStyle,
  buildCssStyleDeclaration
} from "utils/BuildCssStyle.ts";
import { Styles } from "types/card_options";

describe("Test CSS Utils", function () {
  beforeEach(() => {
    const style = document.createElement("style");

    document.head.appendChild(style);
    style.sheet?.insertRule(".test { color: red; } ");
  });

  describe("Test method buildCssStyleDeclaration", function () {
    test("should get style from class css", () => {
      const style = buildCssStyleDeclaration(".test");

      expect(typeof style).not.toEqual("string");
      if (typeof style !== "string") {
        expect(style.color).toEqual("red");
      }
    });

    test("should get style from object", () => {
      const cssProperties = {
        color: "red"
      };

      const style = buildCssStyleDeclaration(cssProperties);

      expect(typeof style).not.toEqual("string");
      if (typeof style !== "string") {
        expect(style.color).toEqual("red");
      }
    });
  });

  describe("Test method buildCssStyle", function () {
    test("should build object styles", () => {
      const styles: Styles = {
        deferred: ".test",
        input: ".test"
      };

      const stylesCreated = buildCssStyle(styles);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(stylesCreated.input!.color).toEqual("red");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(stylesCreated.deferred?.color).toEqual("red");
    });
  });
});
