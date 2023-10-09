import { CssProperties, Styles } from "types/card_options";
import { getStylesFromClass } from "utils/GetStylesFromClass.ts";

export const buildCssStyleDeclaration = (
  cssProperties: CssProperties
): CssProperties => {
  if (typeof cssProperties === "string")
    return getStylesFromClass(cssProperties);
  else return cssProperties;
};

export const buildCssStyle = (styles: Styles) => {
  Object.entries(styles).forEach(([styleKey, styleValue]) => {
    styles = {
      ...styles,
      [styleKey]: buildCssStyleDeclaration(styleValue)
    };
  });

  return styles;
};
