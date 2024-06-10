import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { VisaBrandingRequest } from "types/card_branding_request";

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    VisaSensoryBranding: any;
  }
}

export class VisaAnimationProvider {
  private readonly VISA_COMPLETION_EVENT_ID = "visa-sensory-branding-end";
  private readonly VISA_ASSETS =
    "https://kushki-static.s3.amazonaws.com/visa-sensory-branding/v2";
  private readonly options: VisaBrandingRequest;

  public constructor(opts: VisaBrandingRequest) {
    this.options = opts;
  }

  public async initAnimation(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await import("libs/VisaSensoryBranding/visa-sensory-branding");

        window.VisaSensoryBranding.init(this.options, this.VISA_ASSETS);
        window.VisaSensoryBranding.show();

        window.addEventListener("message", (e) => {
          if (e.data === this.VISA_COMPLETION_EVENT_ID) resolve();
        });
      } catch (error) {
        reject(new KushkiError(ERRORS.E022));
      }
    });
  }
}
