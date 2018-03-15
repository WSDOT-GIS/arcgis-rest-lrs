const path = require("path");

/**
 * Creates a configuration
 * @param {string} libraryTarget Corresponds to output.libraryTarget
 */
function makeConfig(libraryTarget) {
  return {
    mode: "production",
    entry: "./src/lrs.ts",
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
      path: path.resolve(
        __dirname,
        "dist",
        libraryTarget === "commonjs" ? "node" : "umd"
      ),
      filename: "lrs.js",
      library: "wsdotArcgisRestLrs",
      libraryTarget,
      libraryExport: "default"
    },
    externals: /^@esri\/arcgis-rest/
  };
}

module.exports = ["umd", "commonjs"].map(makeConfig);
