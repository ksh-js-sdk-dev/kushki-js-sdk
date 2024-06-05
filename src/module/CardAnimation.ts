import { CardAnimationService } from "service/CardAnimationService.ts";
import { CardBrandingRequest } from "types/card_branding_request";

const requestInitCardBrandingAnimation = (
  opts: CardBrandingRequest
): Promise<void> => CardAnimationService.requestInitCardBrandingAnimation(opts);

export { requestInitCardBrandingAnimation };
export type { CardBrandingRequest };
