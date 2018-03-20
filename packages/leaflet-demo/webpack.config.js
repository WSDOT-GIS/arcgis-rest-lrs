/**
 * When running webpack, this script instructs it to generate the umd (for the browser) and commonjs (node)
 * configurations. The esm (ECMAScript module) version is generated by calling tsc directly so is not
 * handled by this script.
 */

const path = require("path");

module.exports = {
  mode: "production",
  target: "web",
  entry: "./src/index.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(".", "dist"),
    filename: "index.js"
  }
};