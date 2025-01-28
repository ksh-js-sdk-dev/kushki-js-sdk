import { FieldTypeEnum, FieldValidity, FormValidity } from "module/Card.ts";
import { CardPayoutTokenResponse } from "types/card_payout_token_response";

/**
 * This interface contains all methods to use when resolve {@link initCardPayoutToken}
 * @group Card Payouts Interface
 *
 */
export interface ICardPayouts {
  /**
   * Get a secure token or subscriptionId for card payouts transaction
   *
   * This method validates if all fields are valid and obtains a card payout token or subscriptionId, otherwise it will throw an exception
   *
   * @group Methods
   * @return CardPayoutTokenResponse - if isSubscription field is checked return subscriptionId  {@link CardPayoutSubscriptionTokenResponse}, otherwise return token {@link CardPayoutUniqueTokenResponse}
   * @throws KushkiErrorResponse object with code and message of error
   * - if error on request payout token endpoint then throw {@link ERRORS | ERRORS.E002}
   * - if any hosted field is invalid, then throw {@link ERRORS | ERRORS.E007}
   *
   * @example
   * // Example for one-time token
   * // In this case the isSubscription is unchecked or is not rendered with empty isSubscription config
   *
   * try {
   *    const token: CardPayoutTokenResponse = await cardPayouts.requestCardPayoutToken();
   *    // On Success, can get one-time token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
   *    console.log("This is the Token", tokenResponse.token)
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
   *      // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
   *      console.error("Catch error on request device Token", error.code, error.message);
   *  }
   *
   *  @example
   * // Example for subscriptionId token
   * // In this case the isSubscription is checked
   *
   * try {
   *    const token: CardPayoutTokenResponse = await cardPayouts.requestCardPayoutToken();
   *    // On Success, can get subscriptionId response, ex. {subscriptionId: "2029012912", maskedPan: "4242********4242", brand: "visa",}
   *    console.log("This is the subscriptionId", tokenResponse.subscriptionId)
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
   *      // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
   *      console.error("Catch error on request device Token", error.code, error.message);
   *  }
   */
  requestCardPayoutToken(): Promise<CardPayoutTokenResponse>;

  /**
   * This function returns an {@link FormValidity} that represents the validation state of all fields
   *
   * @group Methods
   *
   * @return FormValidity object with validation info of all fields
   * @property {boolean} isFormValid Return validation form
   * @property {Fields} fields Object with Fields (cardholderName, cardNumber, isSubscription(optional))
   *
   * @example
   *
   * Get field validity of cvv field
   *
   * ```ts
   *     const event: FormValidity = cardPayouts.getFormValidity()
   *     // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardNumber, fields: Fields}
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
   * @param {(FormValidity | FieldValidity) => void} event -  Callback is executed when some field changes his validity
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event validity of specific hosted field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'FormValidity' of all hosted fields
   *
   * ```ts
   * try {
   *      cardPayouts.onFieldValidity((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardNumber, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldValidity", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'FieldValidity' of cardNumber field
   *
   * ```ts
   * try {
   *     cardPayouts.onFieldValidity((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardNumber);
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
   * This event is emitted when some field gains focus
   *
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when some field is focused
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event focus and get FieldValidity of specific field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'focus' to get FormValidity
   *
   * ```ts
   * try {
   *      cardPayouts.onFieldFocus((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cardHolderName, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldFocus", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'focus' to get specific hosted field FieldValidity
   *
   * ```ts
   * try {
   *     cardPayouts.onFieldFocus((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardHolderName);
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
   * This event is emitted when some field loses focus
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when some is blurred
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event blur and get FieldValidity of specific field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'blur' to get FormValidity
   *
   * ```ts
   * try {
   *      cardPayouts.onFieldBlur((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldBlur, ex. FormValidity: { isFormValid: true, triggeredBy: isSubscription, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldBlur", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'blur' to get specific FieldValidity
   *
   * ```ts
   * try {
   *     cardPayouts.onFieldBlur((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.isSubscription);
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
   * This event is emitted when some field has submitted.
   *
   * @group Methods
   * @param {(FormValidity | FieldValidity) => void} event - Callback is executed when some field is submitted
   * @param {FieldTypeEnum} fieldType - (optional) Set type of field if you want handle event submit and get FieldValidity of specific field
   *
   * @returns {Promise<void>}
   *
   * @example
   * Handling events 'submit' to get FormValidity
   *
   * ```ts
   * try {
   *      cardPayouts.onFieldSubmit((event: FormValidity) => {
   *        // Implement your logic to handle the event FormValidity here
   *        if (event.fields[event.triggeredBy].isValid) {
   *          console.log("Form valid", event);
   *        } else {
   *          console.log("Form invalid", event);
   *        }
   *      });
   *    // On Success, can get onFieldSubmit, ex. FormValidity: { isFormValid: true, triggeredBy: cardNumber, fields: Fields}
   *  } catch (error: any) {
   *      console.error("Catch error on onFieldSubmit", error.code, error.message);
   *  }
   * ```
   *
   * Handling event 'submit' to get FieldValidity of specific field
   *
   * ```ts
   * try {
   *     cardPayouts.onFieldSubmit((event: FieldValidity) => {
   *        if (event.isValid) {
   *          console.log("Form field is valid", event);
   *        } else {
   *          console.log("Form field is invalid", event);
   *          console.log("this is error", event.errorType);
   *        }
   *      }, FieldTypeEnum.cardNumber);
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
   *    await cardPayouts.focus(FieldTypeEnum.cardholderName);
   *    // On Success, can focus field
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E010", message: "Error al realizar focus en el campo"}
   *      console.error("Catch error on focus field", error.code, error.message);
   *  }
   * ```
   *
   */
  focus(fieldType: FieldTypeEnum): Promise<void>;

  /**
   * Reset hosted field
   *
   * This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception
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
   *    await cardPayouts.reset(FieldTypeEnum.cardholderName);
   *    // On Success, can reset field
   *  } catch (error: any) {
   *      // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
   *      console.error("Catch error on reset field", error.code, error.message);
   *  }
   * ```
   *
   */
  reset(fieldType: FieldTypeEnum): Promise<void>;
}
