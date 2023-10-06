const path = require("path");

module.exports = {
  entry: {
    kushki: "./dist/Kushki.js",
    payment: "./dist/module/Card/Card.js"
  },
  mode: "production",
  output: {
    filename: (pathData) =>
      pathData.chunk.name === "kushki"
        ? "[name].min.js"
        : "[name]/[name].min.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "lib")
  }
};
