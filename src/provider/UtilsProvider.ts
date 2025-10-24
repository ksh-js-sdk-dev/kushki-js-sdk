import { KushkiError, KushkiErrorAttr } from "infrastructure/KushkiError.ts";
import { AxiosError } from "axios";

export class UtilsProvider {
  public static validErrors = (
    error: Error | KushkiError | AxiosError | unknown,
    errorCode: KushkiErrorAttr
  ): Promise<any> => {
    if (error instanceof AxiosError) {
      return Promise.reject(new KushkiError(errorCode, error.message));
    }
    if (error instanceof KushkiError) {
      return Promise.reject(error);
    }
    if (error instanceof Error) {
      return Promise.reject(new KushkiError(errorCode, error.message));
    }

    return Promise.reject(new KushkiError(errorCode));
  };

  public static loadScript = (
    scriptId: string,
    scriptSrc: string,
    notRemove?: boolean
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const lastScript = document.getElementById(scriptId);

      if (lastScript) {
        if (notRemove) {
          resolve();

          return;
        }

        lastScript.remove();
      }

      const script = document.createElement("script");

      script.id = scriptId;
      script.src = scriptSrc;
      script.onload = () => resolve();
      script.onerror = () => reject();

      document.head.appendChild(script);
    });
  };
}
