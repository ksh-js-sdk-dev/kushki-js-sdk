import { IKushki } from "repository/IKushki.ts";
import { CardSubscriptions } from "class/CardSubscriptions.ts";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";
import { ICardSubscriptions } from "repository/ICardSubscriptions.ts";

const initSecureDeviceToken = (
  kushkiInstance: IKushki,
  optionFields: SecureDeviceTokenOptions
): Promise<ICardSubscriptions> =>
  CardSubscriptions.initSecureDeviceToken(kushkiInstance, optionFields);

export { initSecureDeviceToken };

export type { ICardSubscriptions, SecureDeviceTokenOptions };
export type { TokenResponse } from "types/token_response";
