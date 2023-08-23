import { Field, KushkiFields, KushkiFieldsOptions } from "KFields";
import { EnvironmentEnum } from "./infrastructure/EnvironmentEnum.ts";

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

  it("it should return base URL when KushkiFields has property inTest equal to undefined", async function () {
    const kushkiFieldsInstance = await KushkiFields.init(options);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.prod);
  });

  it("it should return base URL of prod when KushkiFields has property inTest equal to false", async function () {
    const optionsToProd: KushkiFieldsOptions = { ...options, inTest: false };

    const kushkiFieldsInstance = await KushkiFields.init(optionsToProd);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.prod);
  });

  it("it should return base URL of uat when KushkiFields has property inTest equal to true", async function () {
    const optionsToUat: KushkiFieldsOptions = { ...options, inTest: true };

    const kushkiFieldsInstance = await KushkiFields.init(optionsToUat);

    expect(kushkiFieldsInstance.baseUrl).toEqual(EnvironmentEnum.uat);
  });
});
