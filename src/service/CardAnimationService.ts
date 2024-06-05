import { CardBrandsEnum } from "infrastructure/CardBrandsEnum.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { MasterCardAnimationProvider } from "provider/MasterCardAnimationProvider.ts";
import { VisaAnimationProvider } from "provider/VisaAnimationProvider.ts";
import {
  CardBrandingRequest,
  MasterCardBrandAnimation,
  VisaBrandingRequest
} from "types/card_branding_request";

export class CardAnimationService {
  public static async requestInitCardBrandingAnimation(
    opts: CardBrandingRequest
  ): Promise<void> {
    if (opts.brand === CardBrandsEnum.VISA) {
      const visaProvider = new VisaAnimationProvider(
        opts as VisaBrandingRequest
      );

      return visaProvider.initAnimation();
    } else if (opts.brand === CardBrandsEnum.MASTERCARD) {
      const mcProvider = new MasterCardAnimationProvider(
        opts as MasterCardBrandAnimation
      );

      return mcProvider.initAnimation();
    } else {
      return Promise.reject(new KushkiError(ERRORS.E022));
    }
  }
}
