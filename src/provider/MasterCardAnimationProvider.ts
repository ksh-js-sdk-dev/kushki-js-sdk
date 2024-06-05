import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { MasterCardBrandAnimation } from "types/card_branding_request";

export class MasterCardAnimationProvider {
  private readonly MC_CONTAINER_ID = "mastercard-sensory-branding";
  private readonly MC_COMPLETION_EVENT_ID = "sonicCompletion";
  private options: MasterCardBrandAnimation;

  public constructor(opts: MasterCardBrandAnimation) {
    this.options = opts;
  }

  public async initAnimation(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const { MCSonic } = await import(
          "libs/MCSensoryBranding/mastercard-sensory-branding"
        );
        const mc_component = new MCSonic();
        const container: HTMLElement | null = document.getElementById(
          this.MC_CONTAINER_ID
        );

        if (this.options.background)
          mc_component!.sonicBackground = this.options.background;
        if (this.options.type) mc_component.type = this.options.type;
        if (this.options.sonicCue)
          mc_component.sonicCue = this.options.sonicCue;

        container!.appendChild(mc_component);
        mc_component!.play();

        document.addEventListener(this.MC_COMPLETION_EVENT_ID, () => resolve());
      } catch (error) {
        reject(new KushkiError(ERRORS.E022));
      }
    });
  }
}
