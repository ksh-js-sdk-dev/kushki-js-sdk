import { AppleTokenResponse } from "types/apple_pay_get_token_events";
import { ApplePayGetTokenOptions } from "types/apple_pay_get_token_options";

/**
 * This interface contains all methods available in the instance returned by {@link initApplePayButton}.
 * @group CardApplePay Interface
 */
export interface ICardApplePay {
  /**
   * This event is used to know when the user clicks on the Apple Pay button.
   *
   * @group Methods
   * @param callback
   * @param {() => void} callback - Callback is executed when:
   *   - The button was successfully initialized.
   *   - The user clicks the button.
   *   - Typically used to start the Apple Pay token request process.
   *
   * @returns {void}
   *
   * @example
   * Instance of cardApplePay is previously initialized with {@link initApplePayButton}
   * ```ts
   * cardApplePay.onClick(() => {
   *    console.log("Apple Pay button clicked");
   * });
   * ```
   */
  onClick(callback: () => void): void;

  /**
   * This event is used to know when the token process is canceled.
   *
   * @group Methods
   * @param callback
   * @param {() => void} callback - Callback is executed when:
   *   - The payment flow is cancelled,
   *   either by the user or due to an unexpected error during the process.
   *
   * @returns {void}
   *
   * @example
   * Instance of cardApplePay is previously initialized with {@link initApplePayButton}
   * ```ts
   * cardApplePay.onCancel(() => {
   *    console.log("Apple Pay token process canceled");
   * });
   * ```
   */
  onCancel(callback: () => void): void;

  /**
   * Starts the Apple Pay payment flow and requests a Kushki card token.
   *
   * This token is already processed and ready to be used in Kushki’s API to perform a **charge**
   *
   * > ⚠️ This method requires that {@link initApplePayButton} has been successfully
   * initialized and uses a valid {@link ICardApplePay} instance.
   *
   * @returns {Promise<AppleTokenResponse>} Promise resolving to the tokenized payment response.
   * @throws
   * - {@link ERRORS | ERRORS.E025}: Apple Pay payments are not available.
   * - {@link ERRORS | ERRORS.E026}: Apple Pay token process fails.
   * - {@link ERRORS | ERRORS.E027}: Apple Pay token process canceled.
   *
   * @example
   * Basic Example usage:
   * ```ts
   * try{
   *    const response = await cardApplePay.requestApplePayToken(
   *      {
   *        countryCode: "EC",
   *        currencyCode: "USD",
   *        displayName: "My Store",
   *        amount: 5000
   *      });
   *
   *    console.log("Card token:", response.token);
   * } catch(error){
   *    console.error("Error requesting token:", error);
   * }
   * ```
   * @example
   * Required billing and shipping data Example usage:
   * ```ts
   * try{
   *    const response = await cardApplePay.requestApplePayToken(
   *      {
   *        countryCode: "EC",
   *        currencyCode: "USD",
   *        displayName: "My Store",
   *        amount: 5000,
   *        optionalApplePayFields:{
   *          requiredBillingContactFields: ["postalAddress"],
   *          requiredShippingContactFields: ["postalAddress"],
   *        }
   *      });
   *
   *    console.log("Card token:", response.token);
   *    console.log("Apple Wallet billing data:", response.billingContact);
   *    console.log("Apple Wallet shipping data:", response.shippingContact);
   * } catch(error){
   *    console.error("Error requesting token:", error);
   * }
   * ```
   *
   * @param {ApplePayGetTokenOptions} options - Configuration options for the Apple Pay payment request.
   * - **countryCode**: Merchant’s country (e.g., `"BR"`, `"CL"`, `"CO"`, `"CR"`, `"EC"`, `"SV"`, `"GT"`, `"HN"`, `"MX"`, `"NI"`, `"PA"`, `"PE"`).
   * - **currencyCode**: Currency for the transaction (e.g., `"USD"`, `"COP"`, `"CLP"`, `"UF"`, `"PEN"`, `"MXN"`, `"BRL"`, `"CRC"`, `"GTQ"`, `"HNL"`, `"NIO"`).
   * - **displayName**: The merchant name displayed in the Apple Pay sheet.
   * - **amount**: Transaction amount.
   * - **optionalApplePayFields**: Additional Apple Pay configuration fields,
   *   following Apple’s specification:
   *   {@link https://developer.apple.com/documentation/applepayontheweb/applepaypaymentrequest}
   *   These fields allow merchants to customize their checkout experience
   *   (e.g., required shipping methods, billing address, etc.).
   *
   */
  requestApplePayToken(
    options: ApplePayGetTokenOptions
  ): Promise<AppleTokenResponse>;
}

/**
 *  Apple session object structure
 */
export interface IAppleSession {
  completePayment: (merchantSession: object) => void;
  completeMerchantValidation: (merchantSession: object) => void;
  abort: () => void;
  validationURL: string;
}
