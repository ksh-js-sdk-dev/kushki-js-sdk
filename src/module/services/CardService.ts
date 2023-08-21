import { KushkiFields, TokenResponse } from "KFields";

export const requestToken = (
  kushkiFields: KushkiFields
): Promise<TokenResponse> => {
  // TODO: remove this console log after to implementation
  console.log(kushkiFields.baseUrl, kushkiFields.options);

  return Promise.resolve({ token: "replace by token response" });
};
