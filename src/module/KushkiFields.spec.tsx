import { Field, KushkiFieldsOptions } from "../../types/kushki_fields_options";
import { KushkiFields } from "./KushkiFields.ts";
import { EnvironmentEnum } from "../infrastructure/EnvironmentEnum.ts";

describe("KushkiFields test", () => {
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

  it("it should return base URL when KushkiFields has property inTest equal to undefined", function () {
    const kushkiFieldsInstance = KushkiFields.init(options);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.prod);
  });

  it("it should return base URL of prod when KushkiFields has property inTest equal to false", function () {
    const optionsToProd: KushkiFieldsOptions = { ...options, inTest: false };

    const kushkiFieldsInstance = KushkiFields.init(optionsToProd);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.prod);
  });

  it("it should return base URL of uat when KushkiFields has property inTest equal to true", function () {
    const optionsToUat: KushkiFieldsOptions = { ...options, inTest: true };

    const kushkiFieldsInstance = KushkiFields.init(optionsToUat);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.uat);
  });
});
