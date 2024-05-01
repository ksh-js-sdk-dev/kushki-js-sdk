/**
 * Interface Cardinal 3DS file.
 */
import { CardTokenResponse } from "types/card_token_response";
import { IKushki } from "Kushki";

export interface ISandbox3DSProvider {
  /**
   *  Init Sandbox Kushki Script
   */
  initSandbox(): void;

  /**
   *  Validate token 3DS security params
   */
  validateSandbox3dsToken(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse
  ): Promise<CardTokenResponse>;
}
