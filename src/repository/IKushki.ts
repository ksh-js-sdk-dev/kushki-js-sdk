import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";

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
   * Get if Kushki instance is in test
   */
  isInTest: () => boolean;
}
