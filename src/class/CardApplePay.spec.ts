import { init } from "Kushki";
import { ApplePayOptions, initApplePayButton } from "Kushki/Card";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { IKushki } from "repository/IKushki.ts";

describe("CardApplePay - Test", () => {
  const mockApplePaySession = (
    canMakePayments: boolean,
    supportsVersion?: boolean,
    beginSpy?: jest.SpyInstance,
    merchantValidationSpy?: jest.Mock,
    completePaymentSpy?: jest.Mock,
    abortSessionSpy?: jest.Mock
  ) => {
    class MockApplePaySession {
      // tslint:disable-next-line:ext-variable-name
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

      constructor(
        public version: number,
        public params: object
      ) {
        // tslint:disable-next-line:no-any
        (<any>window)._appleSession = this;
      }
    }

    (<any>window).ApplePaySession = MockApplePaySession;
  };

  beforeEach(() => {
    mockApplePaySession(true);
  });

  describe("initApplePayButton - method - test", () => {
    const kushkiButtonContainer: string = "kushki-apple-pay-button";
    let kushkiInstance: IKushki;
    let applePayButtonOptions: ApplePayOptions;

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
      kushkiInstance = await init({
        inTest: true,
        publicCredentialId: "ascascasc"
      });

      applePayButtonOptions = {
        locale: "es-MX",
        style: "black",
        type: "pay"
      };
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
});
