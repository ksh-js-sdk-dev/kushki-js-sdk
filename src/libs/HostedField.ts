// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";
import { CardOptions } from "types/card_options";
import { CardTokenResponse } from "types/card_token_response";
import { SiftScienceObject } from "types/sift_science_object";
import { DeferredValues } from "types/card_fields_values";
import { IKushki } from "Kushki";
import { KUSHKI_HOSTED_FIELD_EVENT } from "src/constant/GlobalEventName.ts";

const KushkiHostedFields = zoid.create({
  dimensions: {
    height: "55px",
    width: "300px"
  },
  exports: ({ getExports }: any) => {
    return {
      requestPaymentToken: (
        kushkiInstance: IKushki,
        options: CardOptions,
        requestPath: string,
        jwt?: string,
        siftScienceSession?: SiftScienceObject,
        deferredValues?: DeferredValues
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) =>
          exports.requestPaymentToken(
            kushkiInstance,
            options,
            requestPath,
            jwt,
            siftScienceSession,
            deferredValues
          )
        )
    };
  },
  tag: KUSHKI_HOSTED_FIELD_EVENT,
  url:
    import.meta.env.VITE_SPA_INPUTS_URL ||
    "https://qa-spa-js-inputs.kushkipagos.blue"
  // import.meta.env.VITE_SPA_INPUTS_URL ||
  //   "https://qa-spa-js-inputs.kushkipagos.blue" // uncomment dev locally
});

export default KushkiHostedFields;
