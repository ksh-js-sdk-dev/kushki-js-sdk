const path = require("path");

module.exports = {
  entry: {
    antifraud: "./dist/module/AntiFraud.js",
    card: "./dist/module/Card.js",
    cardAnimation: "./dist/module/CardAnimation.js",
    cardPayouts: "./dist/module/CardPayouts.js",
    kushki: "./dist/module/Kushki.js",
    merchant: "./dist/module/Merchant.js",
    transfer: "./dist/module/Transfer.js"
  },
  mode: "production",
  output: {
    filename: () => "[name].min.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "lib")
  }
};
