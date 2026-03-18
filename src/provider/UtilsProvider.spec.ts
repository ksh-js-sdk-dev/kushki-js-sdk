import { UtilsProvider } from "src/provider/UtilsProvider.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { AxiosError } from "axios";

describe("UtilService - ", () => {
  describe("validErrors - method - test", () => {
    it("When error is of type Error, return detail message", async () => {
      const errorMessage: string = "messageError";
      const error: Error = new Error(errorMessage);

      try {
        await UtilsProvider.validErrors(error, ERRORS.E012);
      } catch (e: any) {
        expect(e.detail).toEqual(errorMessage);
      }
    });

    it("When error is of type KushkiError, return code and message", async () => {
      const error: KushkiError = new KushkiError(ERRORS.E007);

      try {
        await UtilsProvider.validErrors(error, ERRORS.E007);
      } catch (e: any) {
        expect(e.message).toEqual("Error en la validación del formulario");
        expect(e.code).toEqual("E007");
      }
    });

    it("When error is of type AxiosError, return message detail", async () => {
      const errorMessageAxios: string = "messageErrorAxios";
      const error: AxiosError = new AxiosError(errorMessageAxios);

      try {
        await UtilsProvider.validErrors(error, ERRORS.E012);
      } catch (e: any) {
        expect(e.detail).toEqual(errorMessageAxios);
      }
    });

    it("when error is unknown, return code default", async () => {
      const unknownValue: unknown = "Valor desconocido";

      try {
        await UtilsProvider.validErrors(unknownValue, ERRORS.E012);
      } catch (e: any) {
        expect(e.code).toEqual(ERRORS.E012.code);
      }
    });
  });

  describe("loadScript - method - test", () => {
    const scriptIdMock: string = "scriptIdMock";
    const scriptSrcMock: string = "test.com/script.js";

    const executeLoadScript = () => {
      const script = document.getElementById(scriptIdMock);

      if (script && script.onload) {
        // @ts-ignore
        script.onload();
      }
    };

    const executeErrorScript = () => {
      const script = document.getElementById(scriptIdMock);

      if (script && script.onerror) {
        // @ts-ignore
        script.onerror();
      }
    };

    const createPreviousSript = () => {
      const previousScript = document.createElement("script");

      previousScript.id = scriptIdMock;
      previousScript.src = scriptSrcMock;
      document.head.appendChild(previousScript);
    };

    beforeEach(() => {
      const script = document.getElementById(scriptIdMock);

      if (script) script.remove();
    });

    it("should resolve script element creation in head when execute script element onLoad callback", () => {
      UtilsProvider.loadScript(scriptIdMock, scriptSrcMock).then(() => {
        const scriptElement = document.getElementById(scriptIdMock);

        expect(scriptElement).toBeTruthy();
      });

      executeLoadScript();
    });

    it("should reject script creation when execute script element onError callback ", async () => {
      UtilsProvider.loadScript(scriptIdMock, scriptSrcMock).catch((error) => {
        expect(error).toBeUndefined();
      });

      executeErrorScript();
    });

    it("should resolve and reload script when exist previously script with the same id", () => {
      createPreviousSript();

      UtilsProvider.loadScript(scriptIdMock, scriptSrcMock).then(() => {
        const scriptElement = document.getElementById(scriptIdMock);

        expect(scriptElement).toBeTruthy();
      });

      executeLoadScript();
    });

    it("should resolve but not reload script when exist previously script with the same id and send notRemove flag", () => {
      createPreviousSript();

      UtilsProvider.loadScript(scriptIdMock, scriptSrcMock, true).then(() => {
        const scriptElement = document.getElementById(scriptIdMock);

        expect(scriptElement).toBeTruthy();
      });
    });
  });
});
