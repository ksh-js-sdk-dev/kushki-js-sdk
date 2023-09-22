// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CardOptions } from "types/card_options";
import { CardTokenResponse } from "types/card_token_response";

const KushkiHostedFields = zoid.create({
  dimensions: {
    height: "75px",
    width: "400px"
  },
  tag: "kushki-hosted-fields",
  url: "http://localhost:5173",
  exports: ({ getExports }: any) => {
    return {
      requestToken: (
        kushkiGateway: KushkiGateway,
        options: CardOptions
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) =>
          exports.requestToken(kushkiGateway, options)
        )
    };
  }
});

export default KushkiHostedFields;
