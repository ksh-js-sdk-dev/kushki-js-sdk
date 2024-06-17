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
import { BrandByMerchantResponse } from "types/brand_by_merchant_response";
import { TokenResponse } from "types/token_response";
import { CardSubscriptions } from "class/CardSubscriptions.ts";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";
import { ICardSubscriptions } from "repository/ICardSubscriptions.ts";

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
 *  - if into the param `options.fields` not exist the required fields for card or subscription token, then throw {@link ERRORS | ERRORS.E020}
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
 * ##### Card Token to subscriptions, full response, prevent autofill and custom fields
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
 * - To enable fullResponse the `fullResponse` flag must be true, ony for subscriptions
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
 *   fullResponse: true, //To obtain card info from `TokenResponse` when `isSubscription: true`
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
 * ##### Card Subscription Token with optional cvv field
 *
 * ###### Configurations for optional cvv field
 * - The optional cvv is only for subscriptions
 * - To specify if the cvv hosted field is required or not, add the isRequired flag into cvv configuration
 * - If the cvv field is not required, when call requestToken method, the validation omit the cvv if it is empty
 *
 * ```ts
 * const options : CardOptions = {
 *   currency: "USD",
 *   fields: {
 *       cardholderName: {
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          selector: "cardNumber_id"
 *       },
 *       cvv: {
 *          selector: "cvv_id",
 *          isRequired: false // Define the field is required or not, default value is true
 *       },
 *      expirationDate: {
 *          selector: "expirationDate_id"
 *      }
 *   },
 *   isSubscription: true, //Only for subscriptions the cvv can be optional
 * }
 * ```
 *
 * ##### Card Subscription Token with cvv field omitted
 *
 * ###### Configurations for omitted cvv field
 * - The omitted cvv is only for subscriptions
 * - To omit the cvv hosted field delete the cvv configuration
 * - If the cvv configuration not exist, the cvv will no render in the page
 *
 * ```ts
 * const options : CardOptions = {
 *   currency: "USD",
 *   fields: { //Fields without cvv configurations
 *       cardholderName: {
 *          selector: "cardholderName_id"
 *       },
 *       cardNumber: {
 *          selector: "cardNumber_id"
 *       },
 *      expirationDate: {
 *          selector: "expirationDate_id"
 *      }
 *   },
 *   isSubscription: true, //Only for subscriptions the cvv can be omitted
 * }
 * ```
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
  DeferredValuesResponse,
  CardInfo
} from "types/token_response";
export type { Fields, FieldValidity, FormValidity } from "types/form_validity";
export type { DeferredByBinOptionsResponse } from "types/deferred_by_bin_response";
export type { DeferredInputValues } from "types/deferred_input_values";
export type { ERRORS } from "infrastructure/ErrorEnum.ts";
export { InputModelEnum } from "../infrastructure/InputModel.enum.ts";

/**
 * Function to get device token for one-click payment or subscription on-demand
 *
 * @group Methods
 * @param kushkiInstance - Object that that was previously initialized with {@link init} Kushki method
 * @param body - Object with subscriptionId and optional amount or currency
 * @returns {Promise<TokenResponse>} - Object that contains the device token validated
 * @throws
 * - if `options.publicCredentialId` into `kushkiInstance` is not valid or the request fails then throw {@link ERRORS | ERRORS.E003}
 * - if the merchant have SiftScience configurations and `options.subscriptionId` into `body` is not found or the request fails then throw {@link ERRORS | ERRORS.E016}
 * - if the merchant have 3DS configurations and JWT request fails then throw {@link ERRORS | ERRORS.E004}
 * - if the merchant have 3DS configurations and validation challenge fails then throw {@link ERRORS | ERRORS.E005}
 * - if the merchant have 3DS configurations and request token validation fails then throw {@link ERRORS | ERRORS.E006}
 *
 * #### Example
 * ##### Request Device Token
 *
 * ```ts
 * import { init, IKushki } from "@kushki/js-sdk";
 * import { requestDeviceToken, DeviceTokenRequest, TokenResponse } from "@kushki/js-sdk/Card";
 *
 * const onRequestDeviceToken = async () => {
 *     try {
 *       const kushkiInstance: IKushki = await init({
 *         inTest: true,
 *         publicCredentialId: "merchantId"
 *       });
 *       const body: DeviceTokenRequest={
 *         subscriptionId: "subscriptionId"
 *       }
 *
 *       const response: TokenResponse = await requestDeviceToken(kushkiInstance, body);
 *
 *       // On Success, can get device token for one-click payment, ex. {"token":"31674e78f88b41ffaf47998151fb465d"}
 *       console.log(response);
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E017", message: "Error en solicitud de Token de subscripción bajo demanda"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 */
const requestDeviceToken = (
  kushkiInstance: IKushki,
  body: DeviceTokenRequest
): Promise<TokenResponse> =>
  CardService.requestDeviceToken(kushkiInstance, body);

export { requestDeviceToken };
export type { DeviceTokenRequest } from "types/device_token_request";

/**
 * ### Introduction
 * Function to render cvv hosted field and init an instance of {@link ICardSubscriptions}
 * @group Methods
 * @param kushkiInstance - Object that implemented IKushki
 * @param options - You must define setup of cvv field
 * - Define body - {@link DeviceTokenRequest} with subscriptionID [basic example](#md:basic-setup-to-secure-device-token)
 * - if you want to  {@link SecureDeviceTokenOptions.preventAutofill | prevent autofill}  fields (default value is false), [example](#md:card-subscription-body-prevent-autofill-and-custom-field-example)
 * - Set Custom {@link Field | Fields} only for cvv, [example](#md:card-subscription-body-prevent-autofill-and-custom-field-example)
 * - Set custom {@link Styles | Styles} only for cvv, [example](#md:definition-custom-styles)
 * @returns Promise<ICardSubscriptions> - instance of ICardSubscriptions
 * @throws
 * - if params: `options` or `kushkiInstance` are null or undefined then throw {@link ERRORS | ERRORS.E012}
 * - if the param `options.fields` any field has non-existent selector then throw {@link ERRORS | ERRORS.E013}
 *
 * ### Examples
 * #### Basic setup to Secure Device Token
 *
 * ##### Define the container for the cvv field
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cvv_id"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 *
 * ##### Init subscription card instance
 *  - To enable subscription on demand or one click payment, you need to define an subscriptionId and fields. In background this method render the hosted field
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   SecureDeviceTokenOptions,
 *   ICardSubscriptions,
 *   initSecureDeviceToken
 * } from "@kushki/js-sdk/Card";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : SecureDeviceTokenOptions = {
 *   body: {
 *     subscriptionId: "subscriptionId",
 *   },
 *   fields: {
 *       cvv: {
 *          selector: "cvv_id"
 *       }
 *   }
 * }
 *
 * const initCardSubscription = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *      const cardSubscription :  ICardSubscriptions  = await initSecureDeviceToken(kushkiInstance, options)
 *  } catch (e: any) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * #### Card Subscription body, prevent autofill and custom field Example
 *
 * ##### Definition container in html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cvv_id"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 *
 * ##### Init subscription card instance
 * - Can send aditional parameters in body param with properties from {@link DeviceTokenRequest}
 * - To enable prevent autofill in fields the `preventAutofill` flag must be true
 *
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   SecureDeviceTokenOptions,
 *   ICardSubscriptions,
 *   initSecureDeviceToken
 * } from "@kushki/js-sdk/Card";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const options : SecureDeviceTokenOptions = {
 *   body: {
 *     subscriptionId: "subscriptionId",
 *     userId: "userId", //when use preloaded SiftScience service
 *     sessionId: "sessionId" //when use preloaded SiftScience service
 *   },
 *   fields: {
 *       cvv: {
 *          inputType: "password",
 *          label: "CVV",
 *          placeholder: "CVV",
 *          selector: "cvv_id"
 *       },
 *   },
 *   preventAutofill: true, //To Enable prevent autofill in fields this flag must be true
 * }
 *
 * const initCardSubscription = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICardSubscriptions  = await initSecureDeviceToken(kushkiInstance, options)
 *  } catch (e: any) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 *
 * #### Definition Custom Styles
 * Consider the application of the same [definition custom styles](Card.initCardToken.html#md:definition-custom-styles) for card token, the difference is that the styles would be applied only into the cvv field.
 * ##### Definition container in html
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *     <section>
 *         <div id="cvv_id"></div>
 *     </section>
 * </body>
 * </html>
 * ```
 * ##### Init subscription card instance
 * - Can use custom styles only for cvv field
 *
 * ```ts
 * import { IKushki, init, KushkiError } from "@kushki/js-sdk";
 * import {
 *   SecureDeviceTokenOptions,
 *   ICardSubscriptions,
 *   initSecureDeviceToken,
 *   Styles
 * } from "@kushki/js-sdk/Card";
 *
 * const kushkiOptions : KushkiOptions = {
 *   publicCredentialId: 'public-merchant-id',
 *   inTest: true
 * };
 *
 * const hostedFieldsStyles: Styles = {
 *         container: {
 *             display: "flex",
 *         },
 *         input: {
 *             fontSize: "12px",
 *             border: "1px solid #ccc",
 *             borderRadius: "10px",
 *             height: "30px",
 *             width: "300px",
 *         },
 *         focus: {
 *             border: "1px solid #0077ff",
 *             outline: "none",
 *         },
 *         invalid: {
 *             border: "1px solid #ff0000",
 *         }
 *     };
 *
 * const options : SecureDeviceTokenOptions = {
 *   body: {
 *     subscriptionId: "subscriptionId",
 *   },
 *   fields: {
 *       cvv: {
 *          selector: "cvv_id"
 *       },
 *   },
 *   styles: hostedFieldsStyles //custom styles
 * };
 *
 * const initCardSubscription = async () => {
 *  try {
 *      const kushkiInstance : Ikushki =  await init(kushkiOptions);
 *       const cardInstance:  ICardSubscriptions  = await initSecureDeviceToken(kushkiInstance, options)
 *  } catch (e: any) {
 *       console.error(e.message);
 *  }
 * }
 * ```
 */
const initSecureDeviceToken = (
  kushkiInstance: IKushki,
  options: SecureDeviceTokenOptions
): Promise<ICardSubscriptions> =>
  CardSubscriptions.initSecureDeviceToken(kushkiInstance, options);

export { initSecureDeviceToken };

export type { ICardSubscriptions, SecureDeviceTokenOptions };

/**
 * Function to get the card brand list associated with a specific merchant
 *
 * @group Methods
 * @param kushkiInstance - Object that that was previously initialized with {@link init} Kushki method
 * @returns {Promise<BrandByMerchantResponse[]>} - List with all brands associated with the merchant
 * @throws
 *  - if `options.publicCredentialId` into `kushkiInstance` is not valid or the request fails then throw {@link ERRORS | ERRORS.E021}
 *
 * #### Example
 * ##### Basic request Brands by merchant
 *
 * ```ts
 * import { init } from "@kushki/js-sdk";
 * import {BrandByMerchantResponse, requestBrandsByMerchant } from "@kushki/js-sdk/Card";
 *
 * const onRequestBrandByMerchant = async () => {
 *     try {
 *       const kushkiInstance = await init({
 *         inTest: true,
 *         publicCredentialId: "merchantId"
 *       });
 *
 *       const response = await requestBrandsByMerchant(kushkiInstance);
 *
 *       // On Success, can get brand list,
 *       // ex. [{"brand":"visa","url":"https://.../visa.svg"},{"brand":"masterCard","url":"https://.../masterCard.svg"}]
 *       console.log(response);
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E021", message: "Error en solicitud de marcas de tarjetas del comercio"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 */
const requestBrandsByMerchant = (
  kushkiInstance: IKushki
): Promise<BrandByMerchantResponse[]> =>
  CardService.requestBrandsByMerchant(kushkiInstance);

export { requestBrandsByMerchant };
export type { BrandByMerchantResponse } from "types/brand_by_merchant_response";
