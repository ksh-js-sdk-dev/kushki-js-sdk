import { VisaAnimationProvider } from "provider/VisaAnimationProvider.ts";
import { VisaBrandingRequest } from "types/card_branding_request";

describe("VisaCardAnimationProvider - class - test", () => {
  const VISA_CONTAINER_ID = "visa-sensory-branding";
  let optsMock: VisaBrandingRequest;

  const dispatchEventComplete = () => {
    setTimeout(
      () => window.parent.postMessage("visa-sensory-branding-end", "*"),
      0
    );
  };

  const createAnimationContainer = () => {
    const brand_space = document.createElement("div");

    brand_space.id = VISA_CONTAINER_ID;
    document.body.appendChild(brand_space);
  };

  afterEach(() => {
    optsMock = {
      brand: "visa"
    };
  });

  it("should throws error when call initAnimation without div html element", async () => {
    const visaProvider = new VisaAnimationProvider(optsMock);

    try {
      await visaProvider.initAnimation();
    } catch (error: any) {
      expect(error.code).toEqual("E022");
    }
  });

  it("should init animation container when call initAnimation", async () => {
    createAnimationContainer();

    const visaProvider = new VisaAnimationProvider(optsMock);
    const response = visaProvider.initAnimation();

    dispatchEventComplete();

    await expect(response).resolves.toBeUndefined();
    expect(
      document.getElementById(VISA_CONTAINER_ID)!.children[0]
    ).toBeDefined();
  });
});
