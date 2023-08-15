// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";

// TODO: To be defined modify props, queryparams and url
const KushkiHostedFields = zoid.create({
  dimensions: {
    height: "40px",
    width: "200px"
  },
  tag: "kushki-hosted-fields",
  url: "http://localhost:5173/?inputType=CardNumber"
});

export default KushkiHostedFields;
