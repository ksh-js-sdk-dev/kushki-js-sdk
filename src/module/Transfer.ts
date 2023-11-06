import { TransferService } from "service/TransferService.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IKushki, init } from "Kushki";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ERRORS } from "Kushki/Card";
import { BankListResponse } from "types/bank_list_response";

/**
 * Function to get list of available banks for Transfer transactions
 *
 * @group Methods
 * @param kushkiInstance - Object that that was previously initialized with {@link init} Kushki method
 * @returns {Promise<BankListResponse>} - List of available banks
 * @throws
 *  - if `options.publicCredentialId` into `kushkiInstance` is not valid or the request fails then throw {@link ERRORS | ERRORS.E014}
 *
 * #### Example
 * ##### Basic request Bank List
 *
 * ```ts
 * import { init } from "Kushki";
 * import { requestBankList } from "Kushki/Transfer";
 *
 * const onRequestBankList = async () => {
 *     try {
 *       const kushkiInstance = await init({
 *         inTest: true,
 *         publicCredentialId: "merchantId"
 *       });
 *
 *       const response = await requestBankList(kushkiInstance);
 *
 *       // On Success, can get list of banks, ex. [{"code":"0","name":"A continuación seleccione su banco"},{"code":"0001","name":"Kushki bank Colombia"},{"code":"0002","name":"Kushki bank Ecuador"}]
 *       console.log(response);
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E014", message: "Error en solicitud de lista de bancos"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 */
const requestBankList = (kushkiInstance: IKushki): Promise<BankListResponse> =>
  TransferService.requestBankList(kushkiInstance);

export { requestBankList };

export type { BankListResponse };
