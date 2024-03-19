import { IKushki } from "repository/IKushki.ts";
import { SecureInitRequest } from "types/secure_init_request";

export interface IAntiFraud {
  requestSecureInit(
    kushkiInstance: IKushki,
    request: SecureInitRequest
  ): Promise<void>;
}
