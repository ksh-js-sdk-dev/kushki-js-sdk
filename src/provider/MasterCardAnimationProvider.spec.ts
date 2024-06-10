import { MasterCardAnimationProvider } from "provider/MasterCardAnimationProvider.ts";
import { MasterCardBrandingRequest } from "types/card_branding_request";

describe("MasterCardAnimationProvider - class - test", () => {
  const MC_CONTAINER_ID = "mastercard-sensory-branding";
  let optsMock: MasterCardBrandingRequest;

  const mockMCSonic = () => {
    (global as any).MCSonic = jest.fn().mockImplementation(() => {
      const element = document.createElement("div");

      // @ts-ignore
      element.play = jest.fn();

      return element;
    });
  };

  const dispatchEventComplete = () => {
    setTimeout(() => document.dispatchEvent(new Event("sonicCompletion")), 0);
  };

  const createAnimationContainer = () => {
    const brand_space = document.createElement("div");

    brand_space.id = MC_CONTAINER_ID;
    document.body.appendChild(brand_space);
  };

  const removeAnimationContainer = () => {
    const container = document.getElementById(MC_CONTAINER_ID);

    if (container && container.firstChild) {
      container.removeChild(container.firstChild);
    }
  };

  const executeLoadScript = () => {
    const script = document.getElementById("mc-sonic-script");

    if (script && script.onload) {
      // @ts-ignore
      script.onload();
    }
  };

  const executeErrorScript = () => {
    const script = document.getElementById("mc-sonic-script");

    if (script && script.onerror) {
      // @ts-ignore
      script.onerror();
    }
  };

  beforeEach(() => {
    optsMock = {
      brand: "mastercard"
    };
    mockMCSonic();
    removeAnimationContainer();
  });

  it("should throws error when call initAnimation without div html element", async () => {
    const mcProvider = new MasterCardAnimationProvider(optsMock);
    const response = mcProvider.initAnimation();

    executeLoadScript();

    await expect(response).rejects.toHaveProperty("code", "E022");
  });

  it("should throw error when load script fails", async () => {
    const mcProvider = new MasterCardAnimationProvider(optsMock);
    const response = mcProvider.initAnimation();

    executeErrorScript();

    await expect(response).rejects.toHaveProperty("code", "E022");
  });

  it("should init animation container when call initAnimation", async () => {
    createAnimationContainer();

    const mcProvider = new MasterCardAnimationProvider(optsMock);
    const response = mcProvider.initAnimation();

    executeLoadScript();
    dispatchEventComplete();

    await expect(response).resolves.toBeUndefined();

    expect(document.getElementById(MC_CONTAINER_ID)!.children[0]).toBeDefined();
  });

  it("should init animation container with props when call initAnimation", async () => {
    optsMock.background = "black";
    optsMock.sonicCue = "securedby";
    optsMock.type = "sound-only";

    createAnimationContainer();

    const mcProvider = new MasterCardAnimationProvider(optsMock);
    const response = mcProvider.initAnimation();

    executeLoadScript();
    dispatchEventComplete();

    await expect(response).resolves.toBeUndefined();

    expect(
      // @ts-ignore
      document.getElementById(MC_CONTAINER_ID)!.children[0].sonicBackground
    ).toEqual("black");
    expect(
      // @ts-ignore
      document.getElementById(MC_CONTAINER_ID)!.children[0].type
    ).toEqual("sound-only");
    expect(
      // @ts-ignore
      document.getElementById(MC_CONTAINER_ID)!.children[0].sonicCue
    ).toEqual("securedby");
  });
});
