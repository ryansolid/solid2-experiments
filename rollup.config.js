import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import serve from "rollup-plugin-serve";

const TERSER_OPTIONS = {
  module: true,
  compress: { passes: 3 },
  mangle: true,
};

export default {
  input: "src/main.tsx",
  output: { dir: "dist", format: "es" },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      presets: [
        "@babel/preset-typescript",
        ["solid", { omitNestedClosingTags: true }],
      ],
    }),
    resolve({ 
      exportConditions: ["development"],
      extensions: [".js", ".jsx", ".tsx", ".ts"]
    }),
    process.env.production && terser(TERSER_OPTIONS),
    serve({
      port: 3000,
    }),
  ].filter(Boolean),
};
