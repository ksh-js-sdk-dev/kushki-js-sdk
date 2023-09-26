// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";
import { CardOptions } from "types/card_options";
import { CardTokenResponse } from "types/card_token_response";
import { SiftScienceObject } from "types/sift_science_object";
import { DeferredValues } from "types/card_fields_values";
import { Kushki } from "Kushki";

const KushkiHostedFields = zoid.create({
  dimensions: {
    height: "75px",
    width: "400px"
  },
  exports: ({ getExports }: any) => {
    return {
      requestPaymentToken: (
        kushkiInstance: Kushki,
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
  tag: "kushki-hosted-fields",
  url: "http://localhost:5173"
});

export default KushkiHostedFields;
