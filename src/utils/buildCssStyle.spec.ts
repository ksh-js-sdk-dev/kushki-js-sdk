import {
  buildCssStyle,
  buildCssStyleDeclaration,
  buildCssStyleFromCssHostedField,
  getStyleOfDeferred
} from "utils/buildCssStyle.ts";
import { CssHostedField, DeferredStyles, Styles } from "types/card_options";

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

  describe("Test method buildCssStyleFromCssHostedField", function () {
    test("should build styles from object", () => {
      const cssHostedField: CssHostedField = {
        input: ".test",
        label: {
          color: "red"
        }
      };

      const style = buildCssStyleFromCssHostedField(cssHostedField);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(style.input!.color).toEqual("red");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(style.label!.color).toEqual("red");
    });
  });

  describe("Test method getStyleOfDeferred", function () {
    test("should return a empty object when deferred styles is undefined", () => {
      const styles = getStyleOfDeferred(undefined);

      expect(styles).toEqual({});
    });

    test("should build object of styles from deferred styles object", () => {
      const deferredStyles: DeferredStyles = {
        container: ".test",
        creditType: {
          input: ".test"
        }
      };

      const styles = getStyleOfDeferred(deferredStyles);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      expect(styles.container!.color).toEqual("red");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(styles.creditType!.input!.color).toEqual("red");
    });
  });

  describe("Test method buildCssStyle", function () {
    test("should build object styles", () => {
      const styles: Styles = {
        deferred: {
          container: ".test"
        },
        input: ".test"
      };

      const stylesCreated = buildCssStyle(styles);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(stylesCreated.input!.color).toEqual("red");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(stylesCreated.deferred?.container!.color).toEqual("red");
    });
  });
});
