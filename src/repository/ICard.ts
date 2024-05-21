import { FormValidity, TokenResponse } from "module/Card.ts";
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
   *
   *  @example
   * // If flags `isSubscription: true` and `fullResponse: true` in options of `initCardToken`, the `TokenResponse` will contain `CardInfo` object
   * try {
   *    const tokenResponse: TokenResponse = await cardInstance.requestToken();
   *    // On Success, response contains CardInfo ex. {token: "a2b74b7e3cf24e368a20380f16844d16", cardInfo: {expirationDate: "12/34", bin: "41956124", lastFourDigits: "7800", brand: "visa"}}
   *    if(tokenResponse.cardInfo)
   *      console.log("This is a CardInfo", tokenResponse.cardInfo)
   *  } catch (error: any) {
   *      // On Error, catch response
   *      console.error("Catch error on request card Token", error.code, error.message);
   *  }
   */
  requestToken(): Promise<TokenResponse>;

  /**
   * This event is emitted when the field validity changes
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event -  Callback is executed when the hosted field changes it's validity
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event validity of specific hosted field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'validity' of all hosted fields
   *
   * ```ts
   * try {
   *      cardInstance.onFieldValidity((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'validity' of an specific hosted field
   *
   * ```ts
   * try {
   *     cardInstance.onFieldValidity((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardholderName);
   *    // On Success, can get onFieldFocus, ex. FieldValidity : { isValid: false, errorType: "empty"}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   */
  onFieldValidity(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This function returns an {@link FormValidity} that represents the validation state of all fields
   *
   * @group Methods
   *
   * @return FormValidity object with validation info of all fields
   * @property {boolean} isFormValid Return validation form
   * @property {Fields} fields Object with Fields (cardholderName, cardNumber, cvv, expirationDate, deferred (optional))
   *
   * @example
   *
   * Get field validity of all hosted fields
   *
   * ```ts
   * try {
   *     cardInstance.getFormValidity((event: FormValidity) => {
   *       // Implement your logic to handle the event , here
   *        if (event.isFormValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *    );
   *   // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}   *  } catch (error: any) {
   *      console.error("Catch error on getFormValidity", error.code, error.message);
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   *  ```
   *
   */
  getFormValidity(): FormValidity;

  /**
   * This event is emitted when enter value in OTP field to validate code.
   * OTP authentication is a password that is valid for a single transaction. It aims to reduce fraud and provide extra security for your merchant’s online payments. The user will have 3 attempts to enter a valid OTP.
   *
   * This validation will only be executed if the merchant has configured the security rule associated with OTP and the response token contains secureService with KushkiOTP.
   *
   * The OTP validation is triggered when you enter the third digit in the hosted input field. Each validation event will be fired, and you can capture these events using the onError or onSuccess callbacks.
   *
   * @group Methods
   * @param {() => void} onRequired -  Callback is executed when the token created need validation OTP.
   * @param {(ERRORS) => void} onError -  Callback is executed when validation OTP return an error.
   * @param {() => void} onSuccess -  Callback is executed when validation OTP is success.
   *
   * @return {void}
   *
   * @throws
   * - if the validation OTP is invalid, callback onError return error {@link ERRORS | ERRORS.E008}
   *
   * @example
   *
   * Handling events 'otpValidation' of OTP hosted field
   *
   *  ```ts
   *  try {
   *      cardInstance.onOTPValidation(
   *     () => {
   *     // On required callback, is executed when flow requestToken need validate OTP.
   *       console.log("You should implement logic for continue charge process.")
   *     },
   *     (error) => {
   *     // On error callback, is executed when validation OTP is incorrect. You will receive an error with code E008
   *       console.error("Catch error otp", error.code, error.message);
   *     },
   *     () => {
   *     // On success callback, is executed when validation OTP is success.
   *       console.log("You should implement logic for continue charge process after validation OTP success")
   *     }
   *   );
   * } catch (error: any) {
   *   console.error("Catch error on onOTPValidation", error.code, error.message);
   * }
   * ```
   *
   */
  onOTPValidation(
    onRequired: () => void,
    onError: (error: KushkiErrorAttr) => void,
    onSuccess: () => void
  ): void;

  /**
   * This event is emitted when the field gains focus
   *
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the hosted field is focused
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event focus of specific hosted field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'focus' of all hosted fields
   *
   * ```ts
   * try {
   *      cardInstance.onFieldFocus((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'focus' of an especific hosted field
   *
   * ```ts
   * try {
   *     cardInstance.onFieldFocus((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardholderName);
   *    // On Success, can get onFieldFocus, ex. FieldValidity : { isValid: false, errorType: "empty"}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   */
  onFieldFocus(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This event is emitted when the field loses focus
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the hosted field is blurred
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event blur of specific hosted field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'blur' of all hosted fields
   *
   * ```ts
   * try {
   *      cardInstance.onFieldBlur((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldBlur, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldBlur", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'blur' of an especific hosted field
   *
   * ```ts
   * try {
   *     cardInstance.onFieldBlur((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardholderName);
   *    // On Success, can get onFieldBlur, ex. FieldValidity : { isValid: false, errorType: "empty"}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldBlur", error.code, error.message);
   *  }
   * ```
   *
   */
  onFieldBlur(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This event is emitted when the field has submit.
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the hosted field is submitted
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event submit of specific hosted field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'submit' of all hosted fields
   *
   * ```ts
   * try {
   *      cardInstance.onFieldSubmit((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldSubmit, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldSubmit", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'submit' of an especific hosted field
   *
   * ```ts
   * try {
   *     cardInstance.onFieldSubmit((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardholderName);
   *    // On Success, can get onFieldSubmit, ex. FieldValidity : { isValid: false, errorType: "empty"}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldSubmit", error.code, error.message);
   *  }
   * ```
   *
   */
  onFieldSubmit(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * Focus a hosted field
   *
   * This method asynchronously focus a form field of the specified type, otherwise it will throw an exception
   *
   * @group Methods
   * @param {FieldTypeEnum} fieldType - The type of field (optional)
   *
   * @returns {Promise<void>}
   *
   * @throws
   * - if the specified field type is not valid {@link ERRORS | ERRORS.E010}
   *
   * @example
   * ```ts
   * // Basic example
   * try {
   *    await cardInstance.focus(FieldTypeEnum.cardholderName);
   *    // On Success, can focus field, ex. cardholderName focus
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E010", message: "Error al realizar focus en el campo"}
   *      console.error("Catch error on focus field", error.code, error.message);
   *  }
   * ```
   *
   */
  focus(fieldType: FieldTypeEnum): Promise<void>;

  /**
   * Reset a hosted field
   *
   * This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception
   *
   * @group Methods
   * @param {FieldTypeEnum} fieldType - The type of field (optional)
   *
   * @returns {Promise<void>}
   *
   * @throws
   * - if the specified field type is not valid {@link ERRORS | ERRORS.E009}
   *
   * @example
   * ```ts
   * // Basic example
   * try {
   *    await cardInstance.reset(FieldTypeEnum.cardholderName);
   *    // On Success, can reset field, ex. cardholderName empty
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
   *      console.error("Catch error on reset field", error.code, error.message);
   *  }
   * ```
   *
   */
  reset(fieldType: FieldTypeEnum): Promise<void>;
}
