import { IKushki } from "Kushki";
import { Card } from "../class/Card.ts";
import {
  Amount,
  CardOptions,
  CssProperties,
  Currency,
  Field
} from "types/card_options";
import { ICard } from "repository/ICard.ts";

const initCardToken = (
  kushkiInstance: IKushki,
  options: CardOptions
): Promise<ICard> => Card.initCardToken(kushkiInstance, options);

// Main Object
export { initCardToken };

// Types
export type { ICard, Currency, CssProperties, CardOptions, Field, Amount };
export type { CardFieldValues, FieldInstance } from "types/card_fields_values";
export type { CardTokenRequest } from "types/card_token_request";
export type { CardTokenResponse } from "types/card_token_response";
export type { TokenResponse } from "types/token_response";
export type { Fields, FieldValidity, FormValidity } from "types/form_validity";
export type {
  DeferredByBinResponse,
  DeferredByBinOptionsResponse
} from "types/deferred_by_bin_response";
export type { DeferredInputValues } from "types/deferred_input_values";
