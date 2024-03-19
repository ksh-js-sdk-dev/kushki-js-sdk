import { IKushki } from "repository/IKushki.ts";
import { AntiFraudService } from "service/AntiFraudService.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { ErrorResponse } from "types/error_response";
import { SecureInitResponse } from "types/secure_init_response";
import { TokenResponse } from "types/token_response";
import { CardTokenResponse } from "types/card_token_response";

/**
 * #### Introduction
 * Function to request a secure initialization of Cardinal 3DS.
 * @group Methods
 * @param {IKushki} kushkiInstance - The Kushki instance that was previously initialized.
 * @param {SecureInitRequest} secureInitRequest - You must define this object in order to request the initialization of Cardinal 3DS.
 *
 * @returns {Promise<SecureInitResponse | ErrorResponse>} - Returns a Promise that resolves to either a SecureInitResponse or an ErrorResponse.
 *
 * @example
 * ```ts
 * const kushkiInstance = await init({
 *   inTest: true,
 *   publicCredentialId: "public-merchant-id"
 * });
 *
 * const secureInitRequest:SecureInitRequest = {
 *  card:{
 *    number: "card-number"
 *  }
 * };
 *try {
 * const response = await requestSecureInit(kushkiInstance, request);
 * console.log(response);
 * } catch(error) {
 *   console.log(error);
 * }
 */
const requestSecureInit = (
  kushkiInstance: IKushki,
  secureInitRequest: SecureInitRequest
): Promise<SecureInitResponse | ErrorResponse> =>
  AntiFraudService.requestSecureInit(kushkiInstance, secureInitRequest);

/**
 * #### Introduction
 * Function to validate a 3DS request.
 * @group Methods
 *
 * @param {IKushki} kushkiInstance - The Kushki instance that was previously initialized.
 * @param {CardTokenResponse} cardTokenResponse - The response object from the card tokenization process.
 *
 * @returns {Promise<TokenResponse>} - Returns a Promise that resolves to a TokenResponse.
 *
 * @example
 * ```ts
 * const kushkiInstance = await init({
 *   inTest: true,
 *   publicCredentialId: "merchantId"
 * });
 *
 * const cardTokenResponse = {
 *   token:"generated-token",
 *   secureService: "secure-service-name",
 *   secureId: "secure-id",
 *   security: {
 *      acsURL: "https://google.com",
 *      authenticationTransactionId: "transactionId",
 *      authRequired: true,
 *      paReq: "jwt",
 *      specificationVersion: "x.x.x"
 *    }
 * };
 * try {
 *   const tokenResponse = await validate3DS(kushkiInstance, cardTokenResponse);
 *   console.log(tokenResponse);
 * } catch (error) {
 *   console.log(error);
 * }
 *
 * */
const validate3DS = (
  kushkiInstance: IKushki,
  cardTokenResponse: CardTokenResponse
): Promise<TokenResponse> =>
  AntiFraudService.validate3DS(kushkiInstance, cardTokenResponse);

export { requestSecureInit, validate3DS };

export type { SecureInitRequest, SecureInitResponse };
