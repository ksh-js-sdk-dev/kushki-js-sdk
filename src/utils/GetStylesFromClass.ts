import { allowedStyles } from "infrastructure/AllowedStylesEnum.ts";
import { CssProperties } from "types/card_options";

export const getStylesFromClass = (cssClass: string) => {
  const element: HTMLInputElement = document.createElement("input");
  const styles: CssProperties = {};

  if (cssClass[0] === ".") {
    cssClass = cssClass.substring(1);
  }

  element.className = cssClass;
  element.style.display = "none !important";
  element.style.position = "fixed !important";
  element.style.left = "-99999px !important";
  element.style.top = "-99999px !important";
  document.body.appendChild(element);

  const computedStyles: CSSStyleDeclaration = window.getComputedStyle(element);

  allowedStyles.forEach((styleProperty: string) => {
    let valueCssProperty =
      computedStyles[styleProperty as keyof CSSStyleDeclaration];

    if (valueCssProperty) styles[styleProperty] = valueCssProperty;

    valueCssProperty = null;
  });

  document.body.removeChild(element);

  return styles;
};
