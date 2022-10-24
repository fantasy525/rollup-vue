import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import typescript from "@rollup/plugin-typescript";
import html from "@rollup/plugin-html";
import vue from "@vitejs/plugin-vue2";
import autoprefixer from "autoprefixer";
import cleaner from "rollup-plugin-cleaner";
import dev from "rollup-plugin-dev";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import renderHtml from "./public/renderHtml";
// const externalDeps =Object.keys( pkg.peerDependencies).concat(Object.keys(pkg.dependencies)).join('|');
export default {
  input: { main: "./examples/main.ts" },
  output: {
    dir: "dist",
    format: "umd",
    name: "business",
    sourcemap: true,
  },

  plugins: [
    cleaner({ targets: ["dist"] }),
    dev({ dirs: ["dist"] }),
    vue({
      include: ["src/**/*.vue", "examples/**/*.vue"],
      preprocessStyles: true,
    }),
    resolve(),
    commonjs(),
    postcss({
      plugins: [autoprefixer()],
      inject: true,
    }),
    esbuild.default({
      target: "es2020",
      include: /\.[t]s?$/,
      exclude: [],
      define: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      sourcemap: true,
    }),
    html({ template: renderHtml }),
  ],
};
