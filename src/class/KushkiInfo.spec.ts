import { KInfo } from "class/KushkiInfo.ts";
import { PlatformCodeEnum } from "infrastructure/PlatformCodes.enum.ts";
import { version } from "../../package.json";

describe("Test KInfo", function () {
  it("should return Kushki Info in base 64", function () {
    const kushkiInfoBase64 = KInfo.buildKushkiInfo();

    const kushkiInfo = JSON.parse(atob(kushkiInfoBase64));

    expect(kushkiInfo).toEqual({
      platformId: PlatformCodeEnum.KUSHKI_JS_SDK,
      platformVersion: version
    });
  });
});
