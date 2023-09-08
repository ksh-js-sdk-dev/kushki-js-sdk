import { EnvironmentEnum } from "./infrastructure/EnvironmentEnum.ts";
import { Kushki, KushkiOptions } from "./index.ts";

describe("Kushki - test", () => {
  let options: KushkiOptions;

  beforeEach(() => {
    options = {
      inTest: true,
      publicCredentialId: "1234"
    };
  });

  it("when init with isTes in true must return uat url", async () => {
    options = {
      inTest: true,
      publicCredentialId: "1234"
    };

    const kushkiInstance = await Kushki.init(options);

    expect(kushkiInstance.getBaseUrl()).toEqual(EnvironmentEnum.uat);
    expect(kushkiInstance.getPublicCredentialId()).toEqual(
      options.publicCredentialId
    );
  });

  it("when init with isTes in false must return prod url", async () => {
    options = {
      inTest: false,
      publicCredentialId: "1234"
    };

    const kushkiInstance = await Kushki.init(options);

    expect(kushkiInstance.getBaseUrl()).toEqual(EnvironmentEnum.prod);
    expect(kushkiInstance.getPublicCredentialId()).toEqual(
      options.publicCredentialId
    );
  });
});