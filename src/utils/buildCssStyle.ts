import {
  CssHostedField,
  CssProperties,
  DeferredStyles,
  Styles
} from "types/card_options";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { getStylesFromClass } from "utils/getStylesFromClass.ts";

export const buildCssStyleDeclaration = (
  cssProperties: CssProperties
): CssProperties => {
  if (typeof cssProperties === "string")
    return getStylesFromClass(cssProperties);
  else return cssProperties;
};

export const buildCssStyleFromCssHostedField = (styles: CssHostedField) => {
  Object.entries(styles).forEach(([styleKey, styleValue]) => {
    styles[styleKey] = buildCssStyleDeclaration(styleValue);
  });

  return styles;
};

export const getStyleOfDeferred = (
  deferredStyles?: DeferredStyles
): DeferredStyles => {
  if (!deferredStyles) return {};

  deferredStyles.container = buildCssStyleDeclaration(
    deferredStyles.container!
  );

  Object.entries(deferredStyles).forEach(([styleKey, styleValue]) => {
    if (styleKey !== "container")
      deferredStyles[styleKey] = buildCssStyleFromCssHostedField(styleValue);
  });

  return deferredStyles;
};

export const buildCssStyle = (styles: Styles) => {
  Object.entries(styles).forEach(([styleKey, styleValue]) => {
    if (styleKey !== InputModelEnum.DEFERRED) {
      styles = {
        ...styles,
        [styleKey]: buildCssStyleDeclaration(styleValue)
      };
    } else styles.deferred = getStyleOfDeferred(styles.deferred);
  });

  return styles;
};
