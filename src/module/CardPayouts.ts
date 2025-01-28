import { CardPayouts } from "class/CardPayouts.ts";
import { ICardPayouts } from "repository/ICardPayouts.ts";
import { IKushki } from "repository/IKushki.ts";
import { CardPayoutOptions } from "types/card_payout_options";
/**
 * # Introduction
 * Function to init an instance of {@link ICardPayouts}
 * @group Methods
 * @param kushkiInstance - Object that implemented {@link IKushki}
 * @param options - You must define setup of card payout fields
 * - if you want to  {@link CardPayoutOptions.paymentType | payment type} (default value is undefined), max length = 2, [example](#md:options-example)
 * - if you want to  {@link CardPayoutOptions.preventAutofill | prevent autofill}  fields (default value is false), [example](#md:options-example)
 * - Set Custom {@link Field | Fields}, [examples](#md:examples)
 * - Set custom {@link Styles | Styles}, [example](#md:options-example)
 * @returns Promise<ICardPayouts> - instance of ICardPayouts
 * @throws
 *  - if params: `options` or `kushkiInstance` are null or undefined then throw {@link ERRORS | ERRORS.E012}
 *  - if params: `options.paymentType` have invalid length {@link ERRORS | ERRORS.E011}
 *  - if the param `options.fields` in some field has non-existent selector then throw {@link ERRORS | ERRORS.E013}
 *  - if into the param `options.fields` not exist the required fields for card payout token, then throw {@link ERRORS | ERRORS.E020}
 *
 * # Examples
 * ## Basic Card Payout Token
 * ### Define the containers for the hosted fields
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cardholderName_id"/>
 *         <div id="cardNumber_id"/>
 *         <div id="isSubscription_id"/>
 *     </section>
 * </body>
 * </html>
 * ```
 *
 * ### Init card payout token instance
 *  - In background this method render the hosted fields
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   CardPayoutOptions,
 *   ICardPayouts,
 *   initCardPayoutToken
 * } from "@kushki/js-sdk/CardPayouts";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : CardPayoutOptions = {
 *   fields: {
 *       cardholderName: {
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          selector: "cardNumber_id"
 *       },
 *       isSubscription: {
 *          selector: "isSubscription_id"
 *      }
 *   }
 * }
 *
 * const buildCardPayoutInstance = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *      const cardPayoutInstance:  ICardPayouts  = await initCardPayoutToken(kushkiInstance, options)
 *  } catch (e: KushkiError) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * ## Card Payout Token with required isSubscription
 * ### Configurations for required isSubscription field
 * - To specify if the isSubscription hosted field is required or not, add the isRequired flag into isSubscription configuration, default value is false
 * - If the isSubscription field is required, when call requestToken method, the isSubscription checkbox must be checked, otherwise it will throw an error
 * - If the isSubscription field is not required, is not necessary that the isSubscription checkbox to be selected
 *
 * ```ts
 * const options : CardPayoutOptions = {
 *   fields: {
 *       cardholderName: {
 *          label: "Cardholder Name",
 *          placeholder: "Cardholder Name",
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          label: "Card Number",
 *          placeholder: "Card Number",
 *          selector: "cardNumber_id"
 *       },
 *       isSubscription: {
 *          label: "Save card Data",
 *          selector: "isSubscription_id",
 *          isRequired: true,
 *       },
 *   },
 * }
 * ```
 *
 * ## Card Payout Token with isSubscription field omitted
 * ### Configurations for omitted isSubscription field
 * - To omit the isSubscription hosted field delete the isSubscription configuration
 * - If the isSubscription configuration not exist, the isSubscription checkbox will not render in the page
 * - The default value for isSubscription checkbox is false
 * ```ts
 * const options : CardPayoutOptions = {
 *   fields: { //Fields without isSubscription configurations
 *       cardholderName: {
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          selector: "cardNumber_id"
 *       },
 *   },
 * }
 * ```
 *
 * ## Options Example
 * - Consider the application of the same [definition custom styles](Card.initCardToken.html#md:definition-custom-styles) for card token, the difference is that the styles would be applied in payout hosted fields.
 * - Can use preventAutofill flag to enable or disable autofill with navigator data in all fields
 * - Can define the paymentType, this value is send in the token request, only accept two characters
 *
 * ```ts
 *
 * const hostedFieldsStyles: Styles = {
 *    container: {
 *      alignItems: "center",
 *      display: "flex"
 *    },
 *    focus: {
 *      border: "1px solid #0077ff",
 *      outline: "none"
 *    },
 *    input: {
 *      border: "1px solid #ccc",
 *      borderRadius: "10px",
 *      fontSize: "12px",
 *      height: "30px",
 *      width: "300px"
 *    },
 *    invalid: {
 *      border: "1px solid #ff0000"
 *    },
 *    isSubscription: {//consider is a checkbox
 *      "&:invalid": {
 *        appearance: "none",
 *        borderRadius: "3px"
 *      },
 *      height: "15px",
 *      width: "15px"
 *    },
 *    label: {
 *      fontSize: "12px"
 *    }
 *  };
 *
 * const options: CardPayoutOptions = {
 *    fields: {
 *      cardholderName: {
 *        placeholder: "Nombre de Tarjeta",
 *        selector: "cardHolderName_id"
 *      },
 *      cardNumber: {
 *        placeholder: "Número de tarjeta",
 *        selector: "cardNumber_id"
 *      },
 *      isSubscription: {
 *        selector: "isSubscription_id"
 *      }
 *    },
 *    paymentType: "EC",//optional, only two characters,
 *    preventAutofill: true,
 *    styles: hostedFieldsStyles,
 *  }
 * ```
 */
const initCardPayoutToken = (
  kushkiInstance: IKushki,
  options: CardPayoutOptions
): Promise<ICardPayouts> =>
  CardPayouts.initCardPayoutToken(kushkiInstance, options);

export { initCardPayoutToken };
export type { ICardPayouts, CardPayoutOptions };
export type {
  Styles,
  Field,
  InputTypeEnum,
  CssProperties
} from "types/card_payout_options";
export type {
  CardPayoutTokenResponse,
  CardPayoutSubscriptionTokenResponse,
  CardPayoutUniqueTokenResponse
} from "types/card_payout_token_response";
export type { Fields, FieldValidity, FormValidity } from "types/form_validity";
export { InputModelEnum } from "../infrastructure/InputModel.enum.ts";

export type { ERRORS } from "infrastructure/ErrorEnum.ts";
