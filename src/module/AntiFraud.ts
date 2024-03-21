import { IKushki } from "repository/IKushki.ts";
import { AntiFraudService } from "service/AntiFraudService.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { SecureInitResponse } from "types/secure_init_response";
import { TokenResponse } from "types/token_response";
import { CardTokenResponse } from "types/card_token_response";

/**
 * #### Introduction
 * Function to request a secure initialization of Cardinal 3DS or Sandbox 3DS depending on the merchant settings..
 * @group Methods
 * @param {IKushki} kushkiInstance - The Kushki instance that was previously initialized.
 * @param {SecureInitRequest} secureInitRequest - You must define this object in order to request the initialization of 3DS.
 *
 * @returns {Promise<SecureInitResponse>} - Returns a Promise that resolves to either a SecureInitResponse or an ErrorResponse.
 *
 * @throws
 *  - if the param: `secureInitRequest` does not have the needed card length (cardNumber < 6 or cardNumber > 19)  {@link ERRORS | ERRORS.E018}
 *  - if the request fails to obtain the jwt  {@link ERRORS | ERRORS.E004}
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
): Promise<SecureInitResponse> =>
  AntiFraudService.requestSecureInit(kushkiInstance, secureInitRequest);

/**
 * #### Introduction
 * Function to validate 3DS fields from a token.
 * @group Methods
 *
 * @param {IKushki} kushkiInstance - The Kushki instance that was previously initialized.
 * @param {CardTokenResponse} cardTokenResponse - The response object from the card tokenization process using the API.
 *
 * @returns {Promise<TokenResponse>} - Returns a Promise that resolves to a TokenResponse.
 *
 * @throws
 * - if cardinal action code is equal to FAILURE then throw {@link ERRORS | ERRORS.E012}
 *  - if the param `cardTokenResponse.security` is undefined then throw {@link ERRORS | ERRORS.E012}
 *  - if the param `cardTokenResponse.security.authRequired` is the only param in the security object then throw {@link ERRORS | ERRORS.E012}
 *  - if the param `cardTokenResponse.security.specificationVersion` is not valid then throw {@link ERRORS | ERRORS.E012}
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
const requestValidate3DS = (
  kushkiInstance: IKushki,
  cardTokenResponse: CardTokenResponse
): Promise<TokenResponse> =>
  AntiFraudService.requestValidate3DS(kushkiInstance, cardTokenResponse);

export { requestSecureInit, requestValidate3DS };

export type { SecureInitRequest } from "types/secure_init_request";
export type { SecureInitResponse } from "types/secure_init_response";
export type { ERRORS } from "infrastructure/ErrorEnum.ts";
