/**
 * Interface Cardinal 3DS file.
 */
import { TokenResponse } from "types/token_response";
import { CardTokenResponse } from "types/card_token_response";
import { DeferredValues } from "types/card_fields_values";
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
    cardTokenResponse: CardTokenResponse,
    deferredValues: DeferredValues
  ): Promise<TokenResponse>;
}
