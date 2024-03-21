/**
 * Interface Cardinal 3DS file.
 */
import { CardTokenResponse } from "types/card_token_response";
import { DeferredValues } from "types/card_fields_values";
import { IKushki } from "Kushki";
import { TokenResponse } from "types/token_response";

export interface ICardinal3DSProvider {
  /**
   *  Init Cardinal Scripts
   */
  initCardinal(
    kushkiInstance: IKushki,
    jwt: string,
    accountNumber: string
  ): Promise<void>;

  /**
   *  Validate Cardinal session and execute callback
   */
  onSetUpComplete(callback: () => void): Promise<void>;

  /**
   *  Validate token 3DS security params
   */
  validateCardinal3dsToken(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse,
    deferredValues?: DeferredValues
  ): Promise<TokenResponse>;
}
