import { KushkiInfo } from "types/kushki_info";
import { PlatformCodeEnum } from "infrastructure/PlatformCodes.enum.ts";
import { version } from "../../package.json";
import { Buffer } from "buffer";

export class KInfo {
  public static KUSHKI_INFO_HEADER = "X-Amz-Meta-Kushki-Info";
  public static buildKushkiInfo(): string {
    return KInfo._encodeKushkiInfo({
      platformId: PlatformCodeEnum.KUSHKI_JS_SDK,
      platformVersion: version
    });
  }
  private static _encodeKushkiInfo(kushkiInfo: KushkiInfo): string {
    return Buffer.from(JSON.stringify(kushkiInfo)).toString("base64");
  }
}
