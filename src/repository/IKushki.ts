import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { KushkiOptions } from "types/kushki_options";

export interface IKushki {
  /**
   * Get Kushki API url UAT or PROD
   */
  getBaseUrl: () => EnvironmentEnum;

  /**
   * Get Merchant Public Credential
   */
  getPublicCredentialId: () => string;

  /**
   * Get Sift Science env
   */
  getEnvironmentSift: () => string;

  /**
   * Get Kushki Options
   */
  getOptions: () => KushkiOptions;

  /**
   * Get if Kushki instance is in test
   */
  isInTest: () => boolean;
}
