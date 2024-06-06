import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { MasterCardBrandingRequest } from "types/card_branding_request";

declare global {
  // @ts-ignore
  class MCSonic extends HTMLElement {
    public sonicBackground: string;
    public type: string;
    public sonicCue: string;
    public play: () => void;
  }
}

export class MasterCardAnimationProvider {
  private readonly MC_CONTAINER_ID = "mastercard-sensory-branding";
  private readonly MC_COMPLETION_EVENT_ID = "sonicCompletion";
  private readonly MC_SCRIPT_ID = "mc-sonic-script";
  private readonly MC_SCRIPT_URL =
    "https://sonicsdk.mastercard.com/assets/js/latest/js/mc-sonic.min.js";
  private readonly options: MasterCardBrandingRequest;

  public constructor(opts: MasterCardBrandingRequest) {
    this.options = opts;
  }

  public async initAnimation(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this._loadScript();

        const mc_component = new MCSonic();
        const container: HTMLElement | null = document.getElementById(
          this.MC_CONTAINER_ID
        );

        if (this.options.background)
          mc_component.sonicBackground = this.options.background;
        if (this.options.type) mc_component.type = this.options.type;
        if (this.options.sonicCue)
          mc_component.sonicCue = this.options.sonicCue;

        container!.appendChild(mc_component);
        mc_component.play();

        document.addEventListener(this.MC_COMPLETION_EVENT_ID, () => resolve());
      } catch (error) {
        reject(new KushkiError(ERRORS.E022));
      }
    });
  }

  private _loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      const last_script = document.getElementById(this.MC_SCRIPT_ID);

      if (last_script) last_script.remove();

      const script = document.createElement("script");

      script.id = this.MC_SCRIPT_ID;
      script.src = this.MC_SCRIPT_URL;
      script.onload = () => resolve();
      script.onerror = () => reject();

      document.head.appendChild(script);
    });
  };
}
