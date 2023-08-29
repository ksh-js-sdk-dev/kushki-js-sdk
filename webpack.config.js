const path = require("path");

module.exports = {
  entry: {
    Kushki: "./dist/Kushki.js",
    Card: "./dist/card/card.js"
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "lib"),
    libraryTarget: "umd"
  },
  mode: "production"
};
