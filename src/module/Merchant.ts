// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IKushki, init } from "Kushki";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ERRORS } from "Kushki/Card";
import { CommissionConfigurationRequest } from "types/commission_configuration_request";
import { CommissionConfigurationResponse } from "types/commission_configuration_response";
import { MerchantService } from "service/MerchantService.ts";

/**
 * Function to get the information related to the commission charge configured for a specific merchant
 *
 * @group Methods
 * @param kushkiInstance - Object that that was previously initialized with {@link init} Kushki method
 * @param body - Object with amount and currency information
 * @returns {Promise<CommissionConfigurationResponse>} - Object with information about the commission configuration
 * @throws
 *  - if `options.publicCredentialId` into `kushkiInstance` is not valid or the request fails then throw {@link ERRORS | ERRORS.E015}
 *
 * #### Example
 * ##### Basic request Commission Configuration
 *
 * ```ts
 * import { init } from "Kushki";
 * import {CommissionConfigurationRequest, requestCommissionConfiguration } from "Kushki/Merchant";
 *
 * const onRequestCommissionConfiguration = async () => {
 *     try {
 *       const kushkiInstance = await init({
 *         inTest: true,
 *         publicCredentialId: "merchantId"
 *       });
 *       const body: CommissionConfigurationRequest = {
 *         totalAmount: 10,
 *         currency: "USD"
 *       };
 *
 *       const response = await requestCommissionConfiguration(kushkiInstance, body);
 *
 *       // On Success, can get commission config,
 *       // ex. {"commissionMerchantName":"Name","parentMerchantName":"Name","amount":{"currency":"USD","iva":0.45,"subtotalIva":2.5,"subtotalIva0":0},"merchantId":"XXX","totalAmount":2.95}
 *       console.log(response);
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E015", message: "Error en solicitud de configuración de comisión"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 */
const requestCommissionConfiguration = (
  kushkiInstance: IKushki,
  body: CommissionConfigurationRequest
): Promise<CommissionConfigurationResponse> =>
  MerchantService.requestCommissionConfiguration(kushkiInstance, body);

export { requestCommissionConfiguration };

export type { CommissionConfigurationRequest, CommissionConfigurationResponse };
