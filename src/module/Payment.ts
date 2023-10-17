import { IKushki } from "Kushki";
import { Card } from "../class/Card.ts";
import {
  Amount,
  CardOptions,
  CssProperties,
  Currency,
  Field,
  Styles
} from "types/card_options";
import { ICard } from "repository/ICard.ts";

/**
 * #### Introduction
 * Function to init an instance of {@link ICard}
 * @group Methods
 * @param kushkiInstance - Object that implemented IKushki
 * @param options - You must define setup of card fields
 * - Define {@link Amount} of transaction, [example](#md:basic-setup-to-card-token)
 * - Define {@link Currency}  of transaction, [example](#md:basic-setup-to-card-token)
 * - if transaction is {@link CardOptions.isSubscription | subscription} (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields)
 * - if you want to  {@link CardOptions.preventAutofill | prevent autofill}  fields (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields)
 * - Set Custom {@link Field | Fields}, [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields)
 * - Set custom {@link Styles | Styles}, [example](#md:to-start-with-it-necessary-define-style-object)
 * @returns Promise<ICard> - instance of ICard
 * @throws
 *  - if params: `options` or `kushkiInstance` are null or undefined then throw {@link ERRORS | ERRORS.E012}
 *  - if the param `options.fields` any field has non-existent selector then throw {@link ERRORS | ERRORS.E013}
 *
 * #### Examples
 * ##### Basic setup to Card Token
 * ```ts
 * import { IKushki, init, KushkiError } from "Kushki";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "Kushki/Payment";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : CardOptions = {
 *   amount: {
 *      iva: 1,
 *      subtotalIva: 10,
 *      subtotalIva0: 10
 *   },
 *   currency: "USD",
 *   fields: {
 *       cardholderName: {
 *          selector: "id_div_cardholderName"
 *       },
 *       cardNumber: {
 *          selector: "id_div_cardNumber"
 *       },
 *       cvv: {
 *          selector: "id_div_cvv"
 *       },
 *      expirationDate: {
 *          selector: "id_div_expirationDate"
 *      }
 *   }
 * }
 *
 * const buildCardInstance = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 *  } catch (e: KushkiError) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * ### Card Token to subscriptions, prevent autofill and custom fields
 * - To Enable subscriptions the `isSubscription` flag must be true
 * - To Enable prevent autofill in fields the `preventAutofill` flag must be true
 * ```ts
 * import { IKushki, init, KushkiError } from "Kushki";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "Kushki/Payment";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : CardOptions = {
 *   amount: {
 *      iva: 1,
 *      subtotalIva: 10,
 *      subtotalIva0: 10
 *   },
 *   currency: "USD",
 *   fields: {
 *       cardholderName: {
 *          inputType: "text",
 *          label: "card holder Name",
 *          placeholder: "card holder Name",
 *          selector: "id_div_cardholderName"
 *       },
 *       cardNumber: {
 *          inputType: "number",
 *          label: "card Number",
 *          placeholder: "card Number",
 *          selector: "id_div_cardNumber"
 *       },
 *       cvv: {
 *          inputType: "password",
 *          label: "CVV",
 *          placeholder: "CVV",
 *          selector: "id_div_cvv"
 *       },
 *      expirationDate: {
 *          inputType: "text",
 *          label: "expiration date",
 *          placeholder: "expiration date",
 *          selector: "id_div_expirationDate"
 *      }
 *   },
 *   isSubscription: true, //To Enable subscriptions this flag must be true
 *   preventAutofill: true, //To Enable prevent autofill in fields this flag must be true
 * }
 *
 * const buildCardInstance = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 *  } catch (e: KushkiError) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * ###  Enable field OTP and set custom styles
 * #### To Start with it necessary define style object
 * ```ts
 * ```
 * #### Then Set basic custom styles from class css
 * ```ts
 * ```
 * #### (Optional) Set advance custom styles with JSS
 * ```ts
 * ```
 * @see [JSS Documentation](https://cssinjs.org/react-jss/?v=v10.3.0)
 * #### Finally you can init card token instance
 * - To Enable field OTP, you need define the attribute `CardOptions.fields.otp`
 * ```ts
 * import { IKushki, init, KushkiError } from "Kushki";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "Kushki/Payment";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : CardOptions = {
 *   amount: {
 *      iva: 1,
 *      subtotalIva: 10,
 *      subtotalIva0: 10
 *   },
 *   currency: "USD",
 *   fields: {
 *       cardholderName: {
 *          inputType: "text",
 *          label: "card holder Name",
 *          placeholder: "card holder Name",
 *          selector: "id_div_cardholderName"
 *       },
 *       cardNumber: {
 *          inputType: "number",
 *          label: "card Number",
 *          placeholder: "card Number",
 *          selector: "id_div_cardNumber"
 *       },
 *       cvv: {
 *          inputType: "password",
 *          label: "CVV",
 *          placeholder: "CVV",
 *          selector: "id_div_cvv"
 *       },
 *      expirationDate: {
 *          inputType: "text",
 *          label: "expiration date",
 *          placeholder: "expiration date",
 *          selector: "id_div_expirationDate"
 *      },
 *      otp: {
 *       inputType: "password",
 *       label: "OTP verification",
 *       placeholder: "OTP verification",
 *       selector: "id_div_otp"
 *     }
 *   }
 * }
 *
 * const buildCardInstance = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 *  } catch (e: KushkiError) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * ### Enable field Deferred and set custom styles to Deferred inputs
 * Deferred Field has one checkbox and three or one select (It depends on merchant settings). If you need set a custom styles
 * Kushki SDK expose the following selectors
 * #### Selectors to set custom styles to Deferred inputs
 * ```ts
 * ```
 * @see [JSS Documentation](https://cssinjs.org/react-jss/?v=v10.3.0)
 * #### Finally you can init card token instance
 * - To Enable field deferred, you need define the attribute `CardOptions.fields.deferred`
 * ```ts
 * import { IKushki, init, KushkiError } from "Kushki";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "Kushki/Payment";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : CardOptions = {
 *   amount: {
 *      iva: 1,
 *      subtotalIva: 10,
 *      subtotalIva0: 10
 *   },
 *   currency: "USD",
 *   fields: {
 *       cardholderName: {
 *          selector: "id_div_cardholderName"
 *       },
 *       cardNumber: {
 *          selector: "id_div_cardNumber"
 *       },
 *       cvv: {
 *          selector: "id_div_cvv"
 *       },
 *      expirationDate: {
 *          selector: "id_div_expirationDate"
 *      },
 *     deferred: {
 *       deferredInputs: {
 *         deferredCheckbox: {
 *           label: "I want to pay in installments"
 *         },
 *         deferredType: {
 *           hiddenLabel: "deferred Type",
 *           label: "deferred Type",
 *           placeholder: "deferred Type"
 *         },
 *         graceMonths: {
 *           hiddenLabel: "grace months",
 *           label: "grace months",
 *           placeholder: "grace months"
 *         },
 *         months: {
 *           hiddenLabel: "months",
 *           label: "months",
 *           placeholder: "months"
 *         }
 *       },
 *       selector: "id_div_deferred"
 *     },
 *   }
 * }
 *
 * const buildCardInstance = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 *  } catch (e: KushkiError) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 */
const initCardToken = (
  kushkiInstance: IKushki,
  options: CardOptions
): Promise<ICard> => Card.initCardToken(kushkiInstance, options);

// Main Object
export { initCardToken };

// Types
export type {
  ICard,
  Currency,
  CssProperties,
  CardOptions,
  Field,
  Amount,
  Styles
};
export type { CardFieldValues, FieldInstance } from "types/card_fields_values";
export type { CardTokenResponse } from "types/card_token_response";
export type {
  TokenResponse,
  DeferredValuesResponse
} from "types/token_response";
export type { Fields, FieldValidity, FormValidity } from "types/form_validity";
export type { DeferredByBinOptionsResponse } from "types/deferred_by_bin_response";
export type { DeferredInputValues } from "types/deferred_input_values";
export type { ERRORS } from "infrastructure/ErrorEnum.ts";
