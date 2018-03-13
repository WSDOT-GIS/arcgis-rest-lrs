import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript2 from "rollup-plugin-typescript2";
import uglify from "rollup-plugin-uglify";

export default {
  input: "src/lrs.ts",
  output: {
    name: "arcgisLrs",
    file: "dist/umd/lrs.js",
    exports: 'named',
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
