import { FormValidity, TokenResponse } from "module/Payment.ts";
import { KushkiErrorAttr } from "infrastructure/KushkiError.ts";
import { FieldTypeEnum } from "types/form_validity";
import { FieldValidity } from "types/card_fields_values";

/**
 * This interface contains all methods to use when resolve {@link initCardToken}
 * @group Card Interface
 *
 */
export interface ICard {
  /**
   * Get a card payment token
   *
   * This method validates if all fields are valid and obtains a card payment token, otherwise it will throw an exception
   *
   * If the merchant is configured with OTP, 3DS or SiftScience rules, this method automatically do validations for each rule
   *
   * When {@link initCardToken} method is configured as subscription, the token must be used to create a subscription, otherwise you can proceed normally with the charge method for card
   *
   * @group Methods
   * @return TokenResponse object with token, if deferred info exists return this data
   * @throws KushkiErrorResponse object with code and message of error
   * - if error on request card token endpoint then throw {@link ERRORS | ERRORS.E002}
   * - if error on request merchant settings endpoint, then throw {@link ERRORS | ERRORS.E003}
   * - if merchant is configured with 3DS rule and error on request JWT endpoint, then throw {@link ERRORS | ERRORS.E004}
   * - if merchant is configured with 3DS rule and error on 3DS authentication, then throw {@link ERRORS | ERRORS.E005}
   * - if merchant is configured with 3DS rule and error on 3DS session validation, then throw {@link ERRORS | ERRORS.E006}
   * - if any hosted field is invalid, then throw {@link ERRORS | ERRORS.E007}
   * - if merchant is configured with OTP rule and error on OTP validation, then throw {@link ERRORS | ERRORS.E008}
   *
   * @example
   * // Basic example for unique payment or subscription
   * try {
   *    const tokenResponse: TokenResponse = await cardInstance.requestToken();
   *    // On Success, can get card token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
   *    console.log("This is a card Token", tokenResponse.token)
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
   *      // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
   *      console.error("Catch error on request card Token", error.code, error.message);
   *  }
   *
   *  @example
   * // If deferred data is generated, you can use this data in the charge of the payment
   * try {
   *    const tokenResponse: TokenResponse = await cardInstance.requestToken();
   *    // On Success, if deferred data exist can get deferred options
   *    // For Ecuador, Mexico ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {creditType: "03", graceMonths: 2, months: 12}}
   *    // For Chile, Colombia, Peru ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {months: 12}}
   *    if(tokenResponse.deferred)
   *      console.log("This is a deferred options", tokenResponse.deferred)
   *  } catch (error: any) {
   *      // On Error, catch response
   *      console.error("Catch error on request card Token", error.code, error.message);
   *  }
   */
  requestToken(): Promise<TokenResponse>;

  /**
   * This event is emitted when the field validity changes
   *
   * @function
   * @param {(FormValidity | FieldValidity) => void} event - The function called when the form field is validited
   * @param {FieldTypeEnum} [fieldType] - The type of form field (optional)
   * @returns {void}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example 1: Handling a basic form validity event
   * onFieldValidity((event: FormValidity) => {
   *   // Implement your logic to handle the form submission here
   *   if (event.isFormValid) {
   *     console.log("Form submitted valid", event);
   *   } else {
   *     console.log("Form submitted invalid", event);
   *   }
   * });
   *
   * @example
   * // Example 2: Handling a specific type of field focus event
   * onFieldValidity((event: FieldValidity) => {
   *   // Implement your logic to handle the specific field type here
   *   if (event.isValid) {
   *     console.log("Form field is valid", event);
   *   } else {
   *    console.log("Form field is invalid", event);
   *    console.log("this is error", event.errorType);
   *   }
   * }, fieldType: FieldTypeEnum);
   */
  onFieldValidity(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This function returns an {@link FormValidity} that represents the validation state of all fields
   * @return FormValidity object with form inputs information validation
   * @property {boolean} isFormValid Return validation form
   * @property {Fields} fields Object with Fields (cardholderName, cardNumber, cvv, expirationDate, deferred (optional))
   * @example
   *  cardInstance.getFormValidity();
   */
  getFormValidity(): FormValidity;

  /**
   * This event is emitted when enter value in OTP field
   * @return {void}
   * @example
   *  cardInstance.onOTPValidation(
   *    () => { setShowOTP(true);},
   *    (error) => { setErrorOTP(error.message);},
   *    () => { setErrorOTP("");}
   *  );
   * @param onRequired
   * @param onError
   * @param onSuccess
   */
  onOTPValidation(
    onRequired: () => void,
    onError: (error: KushkiErrorAttr) => void,
    onSuccess: () => void
  ): void;

  /**
   * This event is emitted when the field gains focus
   *
   * @function
   * @param {(FormValidity | FieldValidity) => void} event - The function called when the form field is focused
   * @param {FieldTypeEnum} [fieldType] - The type of form field (optional)
   * @returns {void}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example 1: Handling a basic form focus event
   * onFieldFocus((event: FormValidity) => {
   *   // Implement your logic to handle the form submission here
   *   if (event.isFormValid) {
   *     console.log("Form submitted valid", event);
   *   } else {
   *     console.log("Form submitted invalid", event);
   *   }
   * });
   *
   * @example
   * // Example 2: Handling a specific type of field focus event
   * onFieldFocus((event: FieldValidity) => {
   *   // Implement your logic to handle the specific field type here
   *   if (event.isValid) {
   *     console.log("Form field is valid", event);
   *   } else {
   *    console.log("Form field is invalid", event);
   *    console.log("this is error", event.errorType);
   *   }
   * }, fieldType: FieldTypeEnum);
   */
  onFieldFocus(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This event is emitted when the field loses focus
   * @function
   * @param {(FormValidity | FieldValidity) => void} event - The function called when the form field is blurred
   * @param {FieldTypeEnum} [fieldType] - The type of form field (optional)
   * @returns {void}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example 1: Handling a basic form blur event
   * onFieldBlur((event: FormValidity) => {
   *   // Implement your logic to handle the form submission here
   *   if (event.isFormValid) {
   *     console.log("Form submitted valid", event);
   *   } else {
   *     console.log("Form submitted invalid", event);
   *   }
   * });
   *
   * @example
   * // Example 2: Handling a specific type of field blur event
   * onFieldBlur((event: FieldValidity) => {
   *   // Implement your logic to handle the specific field type here
   *   if (event.isValid) {
   *     console.log("Form field is valid", event);
   *   } else {
   *    console.log("Form field is invalid", event);
   *    console.log("this is error", event.errorType);
   *   }
   * }, fieldType: FieldTypeEnum);
   */
  onFieldBlur(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This event is emitted when the field has submit
   * @function
   * @param {(FormValidity | FieldValidity) => void} event - The function called when the form field is submitted
   * @param {FieldTypeEnum} [fieldType] - The type of form field (optional)
   * @returns {void}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example 1: Handling a basic form submit field
   * onFieldSubmit((event: FormValidity) => {
   *   // Implement your logic to handle the form submission here
   *   if (event.isFormValid) {
   *     console.log("Form submitted valid", event);
   *   } else {
   *     console.log("Form submitted invalid", event);
   *   }
   * });
   *
   * @example
   * // Example 2: Handling a specific type of field submission
   * onFieldSubmit((event: FieldValidity) => {
   *   // Implement your logic to handle the specific field type here
   *   if (event.isValid) {
   *     console.log("Form field is valid", event);
   *   } else {
   *    console.log("Form field is invalid", event);
   *    console.log("this is error", event.errorType);
   *   }
   * }, fieldType: FieldTypeEnum);
   */
  onFieldSubmit(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * Asynchronously focuses on a form field of the specified type
   *
   * @param {FieldTypeEnum} fieldType - The type of form field to focus on
   * @returns {Promise<void>}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example: Focus no t on the cardholder name field
   * await focus(FieldTypeEnum.cardholderName);
   * console.log("Cardholder name field is now focused.");
   *
   * @example
   * // Example: Focus on the CVV field
   * await focus(FieldTypeEnum.cvv);
   * console.log("CVV field is now focused.");
   */
  focus(fieldType: FieldTypeEnum): Promise<void>;

  /**
   * Asynchronously resets a form field of the specified type to its default state
   *
   * @param {FieldTypeEnum} fieldType - The type of form field to reset
   * @returns {Promise<void>}
   *
   * @typedef {("cardNumber" | "cardholderName" | "cvv" | "deferred" | "expirationDate")} FieldTypeEnum
   *
   * @example
   * // Example: Reset the cardholder name field
   * await reset(FieldTypeEnum.cardholderName);
   * console.log("Cardholder name field is now reset.");
   *
   * @example
   * // Example: Reset the CVV field
   * await reset(FieldTypeEnum.cvv);
   * console.log("CVV field is now reset.");
   */
  reset(fieldType: FieldTypeEnum): Promise<void>;

  /**
   * This event is emitted when enter value in OTP field
   * @return {void}
   * @example
   *  cardInstance.onOTPValidation(
   *    () => { setShowOTP(true);},
   *    (error) => { setErrorOTP(error.message);},
   *    () => { setErrorOTP("");}
   *  );
   * @param onRequired
   * @param onError
   * @param onSuccess
   */
  onOTPValidation(
    onRequired: () => void,
    onError: (error: KushkiErrorAttr) => void,
    onSuccess: () => void
  ): void;
}
