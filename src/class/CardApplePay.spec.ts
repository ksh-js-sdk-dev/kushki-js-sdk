import { CardApplePay } from "class/CardApplePay.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { IKushki, init } from "Kushki";
import {
  ApplePayOptions,
  ICardApplePay,
  initApplePayButton
} from "Kushki/Card";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { Mock } from "ts-mockery";
import { ApplePayGetTokenOptions } from "types/apple_pay_get_token_options";
import {
  ApplePayGetTokenRequest,
  ApplePaymentEvent
} from "types/apple_pay_get_token_request";

jest.mock("gateway/KushkiGateway.ts");

describe("CardApplePay - Test", () => {
  let kushkiInstance: IKushki;
  let applePayButtonOptions: ApplePayOptions;

  const mockApplePaySession = (
    canMakePayments: boolean,
    supportsVersion?: boolean,
    beginSpy?: jest.SpyInstance,
    merchantValidationSpy?: jest.Mock,
    completePaymentSpy?: jest.Mock,
    abortSessionSpy?: jest.Mock
  ) => {
    class MockApplePaySession {
      public static canMakePayments = jest
        .fn()
        .mockReturnValue(canMakePayments);
      public static supportsVersion = jest
        .fn()
        .mockReturnValue(supportsVersion);

      public begin = beginSpy;
      public completeMerchantValidation = merchantValidationSpy;
      public completePayment = completePaymentSpy;
      public abort = abortSessionSpy;

      public onvalidatemerchant?: (event: ApplePaymentEvent) => void;
      public onpaymentauthorized?: (event: ApplePaymentEvent) => void;

      constructor(
        public version: number,
        public params: object
      ) {
        (<any>window)._appleSession = this;
      }

      public triggerOnValidateMerchant() {
        // @ts-ignore
        this.onvalidatemerchant({
          validationURL: "https://apple.com/sessionStart"
        });
      }

      public triggerOnPaymentAuthorized() {
        // @ts-ignore
        this.onpaymentauthorized({
          payment: {
            token: {
              paymentData: Mock.of<ApplePayGetTokenRequest>({
                data: "test"
              })
            }
          }
        });
      }
    }

    (<any>window).ApplePaySession = MockApplePaySession;
  };

  beforeEach(async () => {
    kushkiInstance = await init({
      inTest: true,
      publicCredentialId: "ascascasc"
    });

    applePayButtonOptions = {
      locale: "es-MX",
      style: "black",
      type: "pay"
    };

    mockApplePaySession(true);
  });

  describe("initApplePayButton - method - test", () => {
    const kushkiButtonContainer: string = "kushki-apple-pay-button";

    const mockLoadScript = (isError?: boolean) => {
      if (isError) {
        jest
          .spyOn(UtilsProvider, "loadScript")
          .mockRejectedValue(new Error("Error"));

        return;
      }

      jest.spyOn(UtilsProvider, "loadScript").mockResolvedValue();
    };

    const createKushkiAppleButtonContainer = () => {
      const divContainer: HTMLDivElement = document.createElement("div");

      divContainer.id = kushkiButtonContainer;
      document.body.appendChild(divContainer);
    };

    const removeKushkiAppleButtonContainer = () => {
      const container = document.getElementById(kushkiButtonContainer);

      if (container) container.remove();
    };

    beforeEach(async () => {
      mockLoadScript();
      createKushkiAppleButtonContainer();
    });

    afterEach(() => {
      removeKushkiAppleButtonContainer();
    });

    it("should create apple-pay-button when load Apple script and canMakePayments successfully", async () => {
      const payment = await initApplePayButton(
        kushkiInstance,
        applePayButtonOptions
      );
      const button = document.querySelector("apple-pay-button");

      expect(payment).toBeDefined();
      expect(button).toBeDefined();
    });

    it("should call onClick callback when click  apple-pay-button", async () => {
      const payment = await initApplePayButton(
        kushkiInstance,
        applePayButtonOptions
      );
      const button = document.querySelector("apple-pay-button");

      expect(button).toBeDefined();

      button!.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

      payment.onClick(() => {
        expect(payment).toBeDefined();
      });
    });

    it("should throws error on promise with error E024 when load script fails", async () => {
      try {
        mockLoadScript(true);
        await initApplePayButton(kushkiInstance, applePayButtonOptions);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.code).toEqual("E024");
      }
    });

    it("should throws error on promise with error E025 when apple can not do payments", async () => {
      try {
        mockApplePaySession(false);
        await initApplePayButton(kushkiInstance, applePayButtonOptions);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.code).toEqual("E025");
      }
    });

    it("should throws error on promise with error E024 when not provide button container", async () => {
      removeKushkiAppleButtonContainer();

      try {
        await initApplePayButton(kushkiInstance, applePayButtonOptions);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.code).toEqual("E024");
      }
    });
  });

  describe("requestApplePayToken - method", () => {
    let options: ApplePayGetTokenOptions;
    let service: ICardApplePay;

    const initService = () => {
      // @ts-ignore
      service = new CardApplePay(kushkiInstance, applePayButtonOptions);
    };

    const runMerchantValidation = async () => {
      const session = (<any>window)._appleSession;

      await session.triggerOnValidateMerchant();
    };

    const runPaymentAuthorized = async () => {
      const session = (<any>window)._appleSession;

      await session.triggerOnPaymentAuthorized();
    };

    const mockKushkiGateway = (
      sessionMock?: jest.Mock,
      tokenMock?: jest.Mock
    ) => {
      // @ts-ignore
      KushkiGateway.mockImplementation(() => ({
        getApplePayToken: tokenMock,
        startApplePaySession: sessionMock
      }));
    };

    beforeEach(() => {
      initService();
      options = {
        amount: 100,
        countryCode: "EC",
        currencyCode: "USD",
        displayName: "Kushki Test"
      };
    });

    it("should run begin method (open apple pay modal) when call requestApplePayToken", async () => {
      const appleBeginSpy = jest.fn();

      mockApplePaySession(true, true, appleBeginSpy);
      service.requestApplePayToken(options);

      expect(appleBeginSpy).toBeCalled();
    });

    it("should call throws error E025 when call requestApplePayToken without apple script init", async () => {
      mockApplePaySession(false);
      try {
        await service.requestApplePayToken(options);
      } catch (e: any) {
        expect(e).toBeInstanceOf(Error);
        expect(e.code).toEqual("E025");
      }
    });

    it("should execute completeMerchantValidation when complete apple session start", async () => {
      const appleBeginSpy = jest.fn();
      const completeMerchantValidationSpy = jest.fn();

      mockKushkiGateway(jest.fn().mockReturnValue({ ok: true }));
      mockApplePaySession(
        true,
        true,
        appleBeginSpy,
        completeMerchantValidationSpy
      );

      initService();
      service.requestApplePayToken(options);

      await runMerchantValidation();

      expect(appleBeginSpy).toBeCalled();
      expect(completeMerchantValidationSpy).toBeCalled();
    });

    it("should throws error and abort apple session when call requestApplePayToken and throws error on start session", async () => {
      const appleBeginSpy = jest.fn();
      const abortSessionSpy = jest.fn();

      mockKushkiGateway(jest.fn().mockRejectedValue("error"));
      mockApplePaySession(
        true,
        true,
        appleBeginSpy,
        undefined,
        undefined,
        abortSessionSpy
      );
      initService();

      const response = service.requestApplePayToken(options);

      await runMerchantValidation();

      await expect(response).rejects.toEqual("error");
      expect(appleBeginSpy).toBeCalled();
      expect(abortSessionSpy).toBeCalled();
    });

    it("should execute completePayment and return token when complete apple payment auth", async () => {
      const appleBeginSpy = jest.fn();
      const completePaymentSpy = jest.fn();

      mockKushkiGateway(
        undefined,
        jest.fn().mockReturnValue({ token: "token" })
      );

      mockApplePaySession(
        true,
        false,
        appleBeginSpy,
        undefined,
        completePaymentSpy
      );
      initService();

      const response = service.requestApplePayToken(options);

      await runPaymentAuthorized();

      await expect(response).resolves.toEqual({ token: "token" });
      expect(appleBeginSpy).toBeCalled();
      expect(completePaymentSpy).toBeCalled();
    });

    it("should throw error and abort apple session when call requestApplePayToken and throws error on get apple pay token", async () => {
      const appleBeginSpy = jest.fn();
      const abortSessionSpy = jest.fn();

      mockKushkiGateway(undefined, jest.fn().mockRejectedValue("error"));

      mockApplePaySession(
        true,
        false,
        appleBeginSpy,
        undefined,
        undefined,
        abortSessionSpy
      );
      initService();

      const response = service.requestApplePayToken(options);

      await runPaymentAuthorized();

      await expect(response).rejects.toEqual("error");
      expect(appleBeginSpy).toBeCalled();
      expect(abortSessionSpy).toBeCalled();
    });
  });

  describe("getClientDomain - static - method", () => {
    let originalWindow: any;

    const mockLocation = (href: string, ancestorOrigins?: string[]) => {
      Object.defineProperty(window, "location", {
        configurable: true,
        get: () => ({
          ancestorOrigins,
          href
        })
      });
    };

    const mockInIframe = (inIframe: boolean) => {
      jest.spyOn(window, "self", "get").mockImplementation(() => window);

      if (inIframe) {
        jest.spyOn(window, "top", "get").mockImplementation(() => ({}) as any);
      } else {
        jest.spyOn(window, "top", "get").mockImplementation(() => window);
      }
    };

    const mockReferrer = (referrer: string) => {
      Object.defineProperty(document, "referrer", {
        configurable: true,
        get: () => referrer
      });
    };

    beforeEach(() => {
      originalWindow = window;
    });

    afterEach(() => {
      // eslint-disable-next-line no-global-assign
      window = originalWindow;
    });

    it("should return current location when execution is in self window", () => {
      mockLocation("https://kushki.example1.com/some/page?x=1#y");
      const domain = CardApplePay.getClientDomain();

      expect(domain).toEqual("kushki.example1.com");
    });

    it("should return parent location when execution is in iframe", () => {
      mockInIframe(true);
      mockLocation("https://kushki.example2.com/some/page?x=1#y", [
        "https://kushki.parent2.com/index.html"
      ]);
      const domain = CardApplePay.getClientDomain();

      expect(domain).toEqual("kushki.parent2.com");
    });

    it("should return referrer location when execution is in iframe but not have ancestorOrigins", () => {
      mockInIframe(true);
      mockLocation("https://kushki.example3.com/some/page?x=1#y");
      mockReferrer("https://kushki.parent3.com/index.html");
      const domain = CardApplePay.getClientDomain();

      expect(domain).toEqual("kushki.parent3.com");
    });
  });
});
