const path = require("path");

module.exports = {
  entry: {
    kushki: "./dist/Kushki.js",
    card: "./dist/module/Payment/card.js"
  },
  output: {
    path: path.resolve(__dirname, "lib"),
    libraryTarget: "umd",
    filename: (pathData) =>
      pathData.chunk.name === "kushki"
        ? "[name].min.js"
        : "[name]/[name].min.js"
  },
  mode: "production"
};
