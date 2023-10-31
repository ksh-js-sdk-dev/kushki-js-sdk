const path = require("path");

module.exports = {
  entry: {
    kushki: "./dist/module/Kushki.js",
    card: "./dist/module/Card.js",
    transfer: "./dist/module/Transfer.js"
  },
  mode: "production",
  output: {
    filename: () => "[name].min.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "lib")
  }
};
