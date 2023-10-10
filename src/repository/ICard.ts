import { FormValidity, TokenResponse } from "module/Payments.index.ts";
import { KushkiErrorAttr } from "infrastructure/KushkiError.ts";
import { FieldTypeEnum } from "types/form_validity";
import { FieldValidity } from "types/card_fields_values";

export interface ICard {
  /**
   * Create token for payment
   * @return TokenResponse object with token and security info
   * @throws KushkiErrorResponse object with code and message of error
   * @example
   *  try {
   *    var tokenResponse;
   *    const token: TokenResponse = await cardInstance.requestToken();
   *    tokenResponse = token.token;
   *  } catch (error: any) {}
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
   * // Example: Focus on the cardholder name field
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
