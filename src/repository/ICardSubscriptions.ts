import {
  DeviceTokenRequest,
  FormValidity,
  TokenResponse
} from "module/Card.ts";
import { FieldTypeEnum } from "types/form_validity";
import { FieldValidity } from "types/card_fields_values";

/**
 * This interface contains all methods to use when resolve {@link initSecureDeviceToken}
 * @group Card Interface
 *
 */
export interface ICardSubscriptions {
  /**
   * Get a secure device token for subscriptions on demand or one-click payment
   *
   * This method validates if cvv field is valid and obtains a device token, otherwise it will throw an exception
   *
   * If the merchant and subscription needs 3DS or SiftScience service, this method automatically do validations for each rule
   *
   * @group Methods
   * @param {DeviceTokenRequest} body - object with subscriptionId and other params for specific cases, see Object documentation
   * @return TokenResponse object with token
   * @throws KushkiErrorResponse object with code and message of error
   * - if error on request device token endpoint then throw {@link ERRORS | ERRORS.E002}
   * - if error on request merchant settings endpoint, then throw {@link ERRORS | ERRORS.E003}
   * - if the merchant have SiftScience configurations and options.subscriptionId into body is not found or the request fails then throw {@link ERRORS | ERRORS.E016}
   * - if merchant is configured with 3DS rule and error on request JWT endpoint, then throw {@link ERRORS | ERRORS.E004}
   * - if merchant is configured with 3DS rule and error on 3DS authentication, then throw {@link ERRORS | ERRORS.E005}
   * - if merchant is configured with 3DS rule and error on 3DS session validation, then throw {@link ERRORS | ERRORS.E006}
   * - if cvv field is invalid, then throw {@link ERRORS | ERRORS.E007}
   * - if `DeviceTokenRequest` body is not defined, then throw {@link ERRORS | ERRORS.E020}
   *
   *  @example
   * // Basic example
   * try {
   *    const tokenResponse: TokenResponse = await cardSubscription.requestDeviceToken({
   *           subscriptionId: "{subscriptionId}",
   *    });
   *    // On Success, can get device token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
   *    console.log("This is a device Token", tokenResponse.token)
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
   *      // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
   *      console.error("Catch error on request device Token", error.code, error.message);
   *  }
   *
   *   @example
   * // Body with params
   * // For 3DS transactions, currency and amount are required
   * try {
   *    const tokenResponse: TokenResponse = await cardSubscription.requestDeviceToken({
   *           amount: { //amount and currency required for 3DS transactions
   *             iva: 10000,
   *             subtotalIva: 0,
   *             subtotalIva0: 0
   *           },
   *           currency: "{currency}",
   *           subscriptionId: "{subscriptionId}",
   *           userId: "{userId}", //when use preloaded SiftScience service
   *           sessionId: "{sessionId}" //when use preloaded SiftScience service
   *    });
   *    // On Success, can get device token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
   *    console.log("This is a device Token", tokenResponse.token)
   *  } catch (error: any) {
   *      console.error("Catch error on request device Token", error.code, error.message);
   *  }
   */
  requestDeviceToken(body?: DeviceTokenRequest): Promise<TokenResponse>;

  /**
   * This function returns an {@link FormValidity} that represents the validation state of cvv field
   *
   * @group Methods
   *
   * @return FormValidity object with validation info of cvv field
   * @property {boolean} isFormValid Return validation form
   * @property {Fields} fields Object with Fields (only cvv)
   *
   * @example
   *
   * Get field validity of cvv field
   *
   * ```ts
   *     const event: FormValidity = cardSubscription.getFormValidity()
   *     // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cvv, fields: Fields}
   *     // Implement your logic to handle the event , here
   *     if (event.isFormValid) {
   *        console.log("Form valid", event);
   *     } else {
   *        console.log("Form invalid", event);
   *     }
   *  ```
   *
   */
  getFormValidity(): FormValidity;

  /**
   * This event is emitted when the field validity changes
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event -  Callback is executed when the cvv field changes his validity
   * @param {FieldTypeEnum} fieldType - (optional) Set type cvv field if you want handle event to get FieldValidity
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'FormValidity' of cvv field
   *
   * ```ts
   * try {
   *      cardSubscription.onFieldValidity((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cvv, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldValidity", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'FieldValidity' of cvv field
   *
   * ```ts
   * try {
   *     cardSubscription.onFieldValidity((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cvv);
   *    // On Success, can get onFieldValidity, ex. FieldValidity : { isValid: false, errorType: "empty"}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldValidity", error.code, error.message);
   *  }
   * ```
   */
  onFieldValidity(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void;

  /**
   * This event is emitted when the cvv field gains focus
   *
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the cvv field is focused
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event focus and get FieldValidity of cvv field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'focus' to get FormValidity
   *
   * ```ts
   * try {
   *      cardSubscription.onFieldFocus((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cvv, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'focus' to get cvv FieldValidity
   *
   * ```ts
   * try {
   *     cardSubscription.onFieldFocus((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cvv);
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
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the cvv field is blurred
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event blur and get FieldValidity of cvv field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'blur' to get FormValidity
   *
   * ```ts
   * try {
   *      cardSubscription.onFieldBlur((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldBlur, ex. FormValidity: { isFormValid: true, triggeredBy: cvv, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldBlur", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'blur' to get cvv FieldValidity
   *
   * ```ts
   * try {
   *     cardSubscription.onFieldBlur((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cvv);
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
   * This event is emitted when the field has submitted.
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when the cvv field is submitted
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event submit and get FieldValidity of cvv field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'submit' to get FormValidity
   *
   * ```ts
   * try {
   *      cardSubscription.onFieldSubmit((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldSubmit, ex. FormValidity: { isFormValid: true, triggeredBy: cvv, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldSubmit", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'submit' to get FieldValidity
   *
   * ```ts
   * try {
   *     cardSubscription.onFieldSubmit((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cvv);
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
   * Focus cvv hosted field
   *
   * This method asynchronously focus cvv field, otherwise it will throw an exception
   *
   * @group Methods
   *
   * @returns {Promise<void>}
   *
   * @throws
   * - if error occurred on focus {@link ERRORS | ERRORS.E010}
   *
   * @example
   * ```ts
   * // Basic example
   * try {
   *    await cardSubscription.focus();
   *    // On Success, can focus field
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E010", message: "Error al realizar focus en el campo"}
   *      console.error("Catch error on focus field", error.code, error.message);
   *  }
   * ```
   *
   */
  focus(): Promise<void>;

  /**
   * Reset cvv hosted field
   *
   * This method asynchronously reset cvv field to its default state, otherwise it will throw an exception
   *
   * @group Methods
   *
   * @returns {Promise<void>}
   *
   * @throws
   * - if error occurred on reset {@link ERRORS | ERRORS.E009}
   *
   * @example
   * ```ts
   * // Basic example
   * try {
   *    await cardSubscription.reset();
   *    // On Success, can reset field
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
   *      console.error("Catch error on reset field", error.code, error.message);
   *  }
   * ```
   *
   */
  reset(): Promise<void>;
}
