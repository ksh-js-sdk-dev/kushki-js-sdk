import { CardAnimationService } from "service/CardAnimationService.ts";
import {
  CardBrandingRequest,
  MasterCardBrandingRequest,
  VisaBrandingRequest
} from "types/card_branding_request";

/**
 * Function to render Visa or MasterCard branding animation
 *
 * @group Methods
 * @param opts - Object that have display and behavior properties of animations. {@link VisaBrandingRequest} for Visa and {@link MasterCardBrandingRequest} for MasterCard
 * @returns {Promise<void>} - On complete animation
 * @throws
 *  - if `opts` is not valid or animation process fails, then throw {@link ERRORS | ERRORS.E022}
 *
 * ## Examples
 * ### Visa Animation with opts
 *
 * Define the animation container
 *
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *   <div id="visa-sensory-branding"/>
 * </body>
 * </html>
 * ```
 * Call the method with opts for Visa
 *
 * ```ts
 * import {
 *   requestInitCardBrandingAnimation,
 *   CardBrandingRequest
 * } from "@kushki/js-sdk/CardAnimation";
 *
 * const onRequestInitCardBrandingAnimation = async () => {
 *     try {
 *       const opts: CardBrandingRequest = {
 *         brand: "visa"
 *         color: "blue"
 *         constrained: true,
 *         sound: true,
 *         checkmark: "checkmarkWithText",
 *         checkmarkTextOption:  "complete",
 *         languageCode: "es"
 *       };
 *
 *       await requestInitCardBrandingAnimation(opts);
 *       // On Success, the animation displayed according the opts into the container defined in the html
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E022", message: "Error al generar animación"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 *
 * ### MasterCard Animation with opts
 *
 * Define the animation container
 *
 * ```html
 * <!DOCTYPE html>
 * <html lang="en">
 * <body>
 *   <div id="mastercard-sensory-branding"/>
 * </body>
 * </html>
 * ```
 * Call the method with opts for MasterCard
 *
 * ```ts
 * import {
 *   requestInitCardBrandingAnimation,
 *   CardBrandingRequest
 * } from "@kushki/js-sdk/CardAnimation";
 *
 * const onRequestInitCardBrandingAnimation = async () => {
 *     try {
 *       const opts: CardBrandingRequest = {
 *         brand: "mastercard"
 *         type: "animation-only",
 *         background: "white",
 *         sonicCue: "securedby",
 *       };
 *
 *       await requestInitCardBrandingAnimation(opts);
 *       // On Success, the animation displayed according the opts into the container defined in the html
 *     } catch (error: any) {
 *       // On Error, catch response, ex. {code:"E022", message: "Error al generar animación"}
 *       console.error(error.message);
 *     }
 *   };
 * ```
 */
const requestInitCardBrandingAnimation = (
  opts: CardBrandingRequest
): Promise<void> => CardAnimationService.requestInitCardBrandingAnimation(opts);

export { requestInitCardBrandingAnimation };
export type {
  CardBrandingRequest,
  VisaBrandingRequest,
  MasterCardBrandingRequest
};
