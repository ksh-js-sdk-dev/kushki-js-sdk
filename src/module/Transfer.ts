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
 * import { init } from "@kushki/js-sdk";
 * import { requestBankList } from "@kushki/js-sdk/Transfer";
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
 *       // On Success, can get list of banks, ex.  [{"code":"0","name":"A continuación seleccione su banco"},{"code":"XXX1","name":"BANCO DE BOGOTA"},{"code":"XXX2","name":"BANCO POPULAR"},{"code":"XXX6","name":"BANCO ITAU"}]
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
