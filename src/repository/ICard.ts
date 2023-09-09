import { TokenResponse } from "Kushki/card";

export interface ICard {
  /**
   * Fetch Token after enter data of card
   * @return TokenResponse .- object with token and security info
   * @throws KushkiErrorResponse .- object with code and message of error
   */
  requestToken(): Promise<TokenResponse>;
}
