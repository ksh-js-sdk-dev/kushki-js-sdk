const path = require("path");

module.exports = {
  entry: {
    kushki: "./dist/module/Kushki.js",
    payment: "./dist/module/Payment.js"
  },
  mode: "production",
  output: {
    filename: () => "[name].min.js",
    libraryTarget: "umd",
    path: path.resolve(__dirname, "lib")
  }
};
