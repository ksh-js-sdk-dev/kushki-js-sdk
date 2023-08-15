import { TokenResponse } from "../../types/remote/token_response";
import {EnvironmentEnum} from "../infrastructure/EnvironmentEnum.ts";

export interface IKushkiFields {
  readonly baseUrl: EnvironmentEnum;
  /**
   * Fetch Token after enter data of card
   * @return TokenResponse .- object with token and security info
   * @throws KushkiErrorResponse .- object with code and message of error
   */
  requestToken(): Promise<TokenResponse>;
}
