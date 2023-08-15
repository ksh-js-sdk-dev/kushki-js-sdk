import { Field, KushkiFieldsOptions } from "../../types/kushki_fields_options";
import { kushkiFieldsInstance } from "./kushkiFieldsInstance.tsx";
import { EnvironmentEnum } from "../infrastructure/EnvironmentEnum.ts";

describe("kushkiFieldsInstance test", () => {
  let options: KushkiFieldsOptions;
  let field: Field;

  beforeEach(() => {
    field = {
      selector: "id_test"
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      },
      publicCredentialId: "publicCredentialId"
    };
  });

  it("it should build a instance with method requestToken that return a promise", function () {
    const instance = new kushkiFieldsInstance(EnvironmentEnum.uat, options);

    expect(instance.requestToken()).resolves.toEqual({
      token: "replace by token response"
    });
  });
});
