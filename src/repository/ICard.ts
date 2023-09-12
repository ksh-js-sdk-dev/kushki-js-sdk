import { FormValidity, TokenResponse } from "Kushki/card";

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
   * This event is emitted when the validity of a field has changed
   * @return {void}
   * @param {function} event Handler the callback for event form validation inputs
   * @function (fieldEvent: FormValidity) => void
   * @example
   *  cardInstance.onFieldValidity((event: FormValidity) => {
   *    console.log(event);
   *  });
   */
  onFieldValidity(event: (fieldEvent: FormValidity) => void): void;

  /**
   * This function returns an {@link FormValidity} that represents the validation state of all fields
   * @return FormValidity object with form inputs information validation
   * @property {boolean} isFormValid Return validation form
   * @property {Fields} fields Object with Fields (cardholderName, cardNumber, cvv, expirationDate, deferred (optional))
   * @example
   *  cardInstance.getFormValidity();
   */
  getFormValidity(): FormValidity;
}
