import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { IKushki, init, KushkiOptions } from "module/Kushki.ts";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum.ts";

describe("Kushki - test", () => {
  let options: KushkiOptions;

  beforeEach(() => {
    options = {
      inTest: true,
      publicCredentialId: "1234"
    };
  });

  it("when init with isTest in true must return uat url", async () => {
    options = {
      inTest: true,
      publicCredentialId: "1234"
    };

    const kushkiInstance: IKushki = await init(options);

    expect(kushkiInstance.getBaseUrl()).toEqual(EnvironmentEnum.uat);
    expect(kushkiInstance.getPublicCredentialId()).toEqual(
      options.publicCredentialId
    );
    expect(kushkiInstance.getEnvironmentSift()).toEqual(SiftScienceEnum.uat);
    expect(kushkiInstance.getOptions()).toEqual(options);
  });

  it("when init with isTest in false must return prod url", async () => {
    options = {
      inTest: false,
      publicCredentialId: "1234"
    };

    const kushkiInstance: IKushki = await init(options);

    expect(kushkiInstance.getBaseUrl()).toEqual(EnvironmentEnum.prod);
    expect(kushkiInstance.getPublicCredentialId()).toEqual(
      options.publicCredentialId
    );
    expect(kushkiInstance.getEnvironmentSift()).toEqual(SiftScienceEnum.prod);
  });

  it("when pass options with incorrect body, should return error controlled", async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await init({});
    } catch (error: any) {
      expect(error.code).toEqual("E011");
    }
  });
});
