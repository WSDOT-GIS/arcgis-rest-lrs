import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";

export default {
  input: "src/index.ts",
  output: {
    name: "arcgisLrs",
    file: "dist/umd/index.js",
    format: "umd",
    sourcemap: true
  },
  plugins: [
    typescript2(),
    json(),
    nodeResolve(),
    commonjs(),
    uglify(),
    filesize()
  ]
};
