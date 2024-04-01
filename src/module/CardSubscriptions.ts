import { IKushki } from "repository/IKushki.ts";
import { CardSubscriptions } from "class/CardSubscriptions.ts";
import { Field } from "types/card_options";

const initSecureDeviceToken = (
  kushkiInstance: IKushki,
  optionFields: Field
): Promise<CardSubscriptions> =>
  CardSubscriptions.initSecureDeviceToken(kushkiInstance, optionFields);

export { initSecureDeviceToken };
