/**
 * Interface Cardinal 3DS file.
 */
import { CardTokenResponse } from "types/card_token_response";
import { IKushki } from "Kushki";

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
    cardTokenResponse: CardTokenResponse
  ): Promise<CardTokenResponse>;
}
