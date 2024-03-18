import { IKushki } from "Kushki";
import { Card } from "class/Card";
import {
  Amount,
  CardOptions,
  CssProperties,
  Currency,
  Field,
  Styles
} from "types/card_options";
import { ICard } from "repository/ICard.ts";
import { FieldTypeEnum } from "types/form_validity";
import { DeviceTokenRequest } from "types/device_token_request";
import { CardService } from "service/CardService.ts";
import { TokenResponse } from "types/token_response";

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
 * - Set custom {@link Styles | Styles}, [example](#md:definition-custom-styles)
 * @returns Promise<ICard> - instance of ICard
 * @throws
 *  - if params: `options` or `kushkiInstance` are null or undefined then throw {@link ERRORS | ERRORS.E012}
 *  - if the param `options.fields` any field has non-existent selector then throw {@link ERRORS | ERRORS.E013}
 *
 * #### Examples
 * ##### Basic setup to Card Token
 *
 * ###### Define the containers for the hosted fields
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cardholderName_id"></div>
 *         <div id="cardNumber_id"></div>
 *         <div id="cvv_id"></div>
 *         <div id="expirationDate_id"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 *
 * ###### Init card token instance
 *  - To enable normal card transaction, you need to define an amount, currency and fields. In background this method render the hosted fields
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "@kushki/js-sdk/Card";
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
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          selector: "cardNumber_id"
 *       },
 *       cvv: {
 *          selector: "cvv_id"
 *       },
 *      expirationDate: {
 *          selector: "expirationDate_id"
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
 * ##### Card Token to subscriptions, prevent autofill and custom fields
 *
 * ###### Definition containers in html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cardholderName_id"></div>
 *         <div id="cardNumber_id"></div>
 *         <div id="cvv_id"></div>
 *         <div id="expirationDate_id"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 *
 * ###### Init card token instance
 * - To enable subscription transactions the `isSubscription` flag must be true
 * - To enable prevent autofill in fields the `preventAutofill` flag must be true
 *
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "@kushki/js-sdk/Card";
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
 *          label: "Cardholder Name",
 *          placeholder: "Cardholder Name",
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          inputType: "number",
 *          label: "Card Number",
 *          placeholder: "Card Number",
 *          selector: "cardNumber_id"
 *       },
 *       cvv: {
 *          inputType: "password",
 *          label: "CVV",
 *          placeholder: "CVV",
 *          selector: "cvv_id"
 *       },
 *      expirationDate: {
 *          inputType: "text",
 *          label: "Expiration Date",
 *          placeholder: "Expiration Date",
 *          selector: "expirationDate_id"
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
 * #####  Enable field OTP and set custom styles
 *
 * ###### Definition containers in html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="id_cardholderName"></div>
 *         <div id="id_cardNumber"></div>
 *         <div id="id_cvv"></div>
 *         <div id="id_expirationDate"></div>
 *         <div id="id_otp"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 * ###### Definition Custom Styles
 * If you want to apply custom styles to hosted files, Kushki SDK expose the interface {@link Styles}, so you have two ways to set your styles:
 *  - Css Classes.- The interface {@link CssProperties} allows to receive a string, so you can configure a CSS class of your site
 *  - [JSS](https://cssinjs.org/react-jss/?v=v10.3.0) Object.- The interface {@link CssProperties} allows to receive an object, so you can configure custom CSS styles
 *
 *  **Notes**:
 *  - You could combine both options, some attributes of {@link Styles} can be classes CSS and others be a object
 *
 * ###### Definition of scopes for attributes of {@link Styles}
 *
 *  Global Scopes
 * - {@link Styles.input  | input}: set styles to all inputs except in deferred input
 * - {@link Styles.label  | label}: set styles to all labels of inputs except in deferred input
 * - {@link Styles.container  | container}: set styles to all containers of inputs except in deferred input
 * - {@link Styles.focus  | focus}: set styles to state focus of inputs except in deferred input
 * - {@link Styles.valid  | valid}:  set styles to state valid of inputs
 * - {@link Styles.invalid  | invalid}:  set styles to state invalid of inputs
 *
 * Specific Hosted Field Input
 *
 * - {@link Styles.cardholderName  | cardholderName}: this styles overwrite the values of input styles only to cardholderName input
 * - {@link Styles.cardNumber  | cardNumber}: this styles overwrite the values of input styles only to cardNumber input
 * - {@link Styles.expirationDate  | expirationDate}: this styles overwrite the values of input styles only to expirationDate input
 * - {@link Styles.cvv  | cvv}: this styles overwrite the values of input styles only to cvv input
 * - {@link Styles.otp  | otp}: this styles overwrite the values of input styles only to otp input
 * - {@link Styles.deferred  | deferred}: this styles overwrite default styles, and set styles to their subcomponents with custom selectors, [more details](#md:selectors-to-set-custom-styles-to-deferred-input)
 *
 * ###### Custom styles from class css
 *
 * In a CSS file, define your class or classes
 * ```css
 * .kushki-hosted-field-label {
 *     color: red;
 * }
 *
 * .kushki-hosted-field-input {
 *    font-size: 14px;
 * }
 *
 * .kushki-hosted-field-cardNumber {
 *    color: green;
 * }
 *
 * .kushki-hosted-field-container {
 *    display: flex;
 * }
 * ```
 * ###### Define {@link Styles} object
 *
 * ```ts
 * const hostedFieldsStyles : Styles = {
 *     container: "kushki-hosted-field-container",
 *     input: "kushki-hosted-field-input",
 *     label: "kushki-hosted-field-label",
 *     cardNumber: "kushki-hosted-field-cardNumber", //overwrite input styles
 * }
 * ```
 * ###### Custom styles with JSS
 * ```ts
 * const hostedFieldsStyles : Styles = {
 *   container: {
 *     alignItems: "center",
 *     display: "flex",
 *     flexDirection: "column",
 *     position: "relative"
 *   },
 *   input: {
 *     fontFamily: "Arial,Verdana,Tahoma",
 *     width: "300px"
 *   },
 *   focus: {
 *     border: "1px solid #0077ff", //set styles in focus event to all inputs
 *   },
 *   cardNumber:  { //overwrite input styles
 *     color: "red",
 *     width: "400px"
 *   }
 * }
 * ```
 * ###### Pseudo Elements with JSS
 * ```ts
 * const hostedFieldsStyles : Styles = {
 *   container: {
 *     alignItems: "center",
 *     display: "flex",
 *     flexDirection: "column",
 *     position: "relative"
 *   },
 *   input: {
 *     fontFamily: "Arial,Verdana,Tahoma",
 *     width: "300px"
 *   },
 *   focus: {
 *     border: "1px solid #0077ff", //set styles in focus event to all inputs
 *   }
 *   cardNumber:  { //overwrite input styles
 *     color "red",
 *     width: "400px",
 *     "&:focus": { // this way you can configure styles for an specific field for the focus event
 *       borderColor: "#CD00DA"  //overwrite  focus event styles
 *     }
 *   }
 * }
 * ```
 *
 * ###### Init card token instance
 * - To Enable field OTP, you need define the attribute `CardOptions.fields.otp`
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "@kushki/js-sdk/Card";
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
 *          selector: "id_cardholderName"
 *       },
 *       cardNumber: {
 *          selector: "id_cardNumber"
 *       },
 *       cvv: {
 *          selector: "id_cvv"
 *       },
 *      expirationDate: {
 *          selector: "id_expirationDate"
 *      },
 *      otp: { // Add new attribute with otp field values
 *       inputType: "password",
 *       label: "OTP Verification",
 *       placeholder: "OTP Verification",
 *       selector: "id_otp"
 *     }
 *   },
 *   styles: hostedFieldsStyles // Add new attribute with styles values
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
 * ##### Enable field Deferred and set custom styles to Deferred inputs
 * Deferred Field has one checkbox and three or one select (It depends on merchant settings). If you need set a custom styles
 * Merchants from Ecuador or Mexico have three selects: credit type, months and grace months; nevertheless, merchants from Colombia, Peru and Chile have one select: months
 *
 * Kushki SDK expose the following selectors
 *
 * ###### Definition containers in html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="id_cardholderName"></div>
 *         <div id="id_cardNumber"></div>
 *         <div id="id_cvv"></div>
 *         <div id="id_expirationDate"></div>
 *         <div id="id_deferred"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 * ###### Selectors to set custom styles to Deferred input
 * Deferred input has styles by default, but Kushki SDK allow custom each element
 *
 * Follow description define scope of each custom selector
 * **Apply Styles to Select elements**
 * - ```&:valid```: set styles when one option was selected
 * - ```&:invalid``` set styles when any option wasn't selected and this select is required
 * - ```&label``` set styles to all labels of selects
 * - ```&label:invalid``` set styles to all labels when any option wasn't selected and this select is required
 *
 * **Apply Styles to checkbox element**
 * - ```&#ksh-deferred-checkbox```: this selector allow to change color of border, background, box shadow and any more in checkbox
 * - ```&#ksh-deferred-checkbox:checked``` this selector allow to change color of border, background, box shadow, color of checkmark and any more in checkbox
 * - ```&#ksh-deferred-checkbox>label``` this selector allow custom the label of checkbox
 *
 * **Apply Styles to containers elements**
 * - ```&#ksh-deferred-creditType```: this selector allow change width, high and others properties of 'credit type' container. Just enable to merchants of Ecuador and Mexico
 * - ```&#ksh-deferred-months```: this selector allow change width, high and others properties of 'months' container
 * - ```&#ksh-deferred-graceMonths```: this selector allow change width, high and others properties of 'grace months' container. Just enable to merchants of Ecuador and Mexico
 *
 *
 * ```ts
 * const hostedFieldsStyles : Styles = {
 * ...
 *  deferred: {
 *   //root properties are applied to selects elements
 *   color: "#56048c",
 *   borderColor: "rgba(0,173,55,0.4)",
 *
 *   //Applying Styles to Select elements
 *   "&:valid": {
 *     borderColor: "rgba(0,192,176,0.4)",
 *   },
 *
 *   "&:invalid": {
 *     color: "#fffb00",
 *     borderColor: "#fffb00",
 *   },
 *
 *   "&label": {
 *     color: "#56048c"
 *   },
 *
 *   "&label:invalid": {
 *     color: "#fffb00"
 *   },
 *
 *   //Applying Styles to checkbox element
 *   "&#ksh-deferred-checkbox": {
 *     backgroundColor: "#ffa400",
 *     borderColor: "#083198"
 *   },
 *
 *   "&#ksh-deferred-checkbox:checked": {
 *     backgroundColor: "#1b9600",
 *     borderColor: "#FFF"
 *   },
 *
 *   "&#ksh-deferred-checkbox>label": {
 *     color: "#56048c"
 *   },
 *
 *  //Applying Styles to containers elements
 *  "&#ksh-deferred-creditType": {
 *    width: "290px"
 *  },
 *  "&#ksh-deferred-graceMonths": {
 *    width: "140px"
 *  },
 *  "&#ksh-deferred-months": {
 *    width: "140px"
 *  },
 * }
 * ..
 * }
 * ```
 *
 * ##### Init card token instance
 * - To Enable field deferred, you need define the attribute `CardOptions.fields.deferred`
 *
 *
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   CardOptions,
 *   ICard,
 *   initCardToken
 * } from "@kushki/js-sdk/Card";
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
 *          selector: "id_cardholderName"
 *       },
 *       cardNumber: {
 *          selector: "id_cardNumber"
 *       },
 *       cvv: {
 *          selector: "id_cvv"
 *       },
 *      expirationDate: {
 *          selector: "id_expirationDate"
 *      },
 *     deferred: {
 *       deferredInputs: {
 *         deferredCheckbox: {
 *           label: "I want to pay in installments"
 *         },
 *         deferredType: {
 *           hiddenLabel: "deferred_Type",
 *           label: "Deferred Type",
 *           placeholder: "deferred Type"
 *         },
 *         graceMonths: {
 *           hiddenLabel: "grace_months",
 *           label: "Grace Months",
 *           placeholder: "grace months"
 *         },
 *         months: {
 *           hiddenLabel: "months",
 *           label: "Months",
 *           placeholder: "months"
 *         }
 *       },
 *       selector: "id_deferred"
 *     },
 *   },
 *   styles: hostedFieldsStyles //Add new attribute with styles values
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
  Styles,
  FieldTypeEnum
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
export { InputModelEnum } from "../infrastructure/InputModel.enum.ts";

const requestDeviceToken = (
  kushkiInstance: IKushki,
  body: DeviceTokenRequest
): Promise<TokenResponse> =>
  CardService.requestDeviceToken(kushkiInstance, body);

export { requestDeviceToken };
export type { DeviceTokenRequest } from "types/device_token_request";
