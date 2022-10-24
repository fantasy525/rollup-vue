import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';
import vue from "@vitejs/plugin-vue2";
import autoprefixer from "autoprefixer";
import cleaner from "rollup-plugin-cleaner";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";
// import { terser } from "rollup-plugin-terser";

// import path from 'path';
const dependencies = pkg.dependencies || [];
const peerDependencies = pkg.peerDependencies || [];
const externalDeps = Object.keys(peerDependencies)
  .concat(Object.keys(dependencies))
  .join("|");

export default {
  input: { index: "./src/index.ts" },
  external: (id) => {
    /**
     * 安装的 peerDependencies 包名必须写在这里，否则会打包到 bundle
     * 1. babel 的辅助函数需要排除
     * 2. core-js polyfill 垫片相关,此处使用全局污染的方式，避免跟业务方冲突
     *
     * */

    const reg = new RegExp(`(${externalDeps})`);
    if (/\.vue$/.test(id)) {
      return false;
    }
    return reg.test(id);
  },
  output: {
    dir: "dist",
    format: "cjs",
    name: "business",
    sourcemap: false,
  },
  plugins: [
    cleaner({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    vue({
      include: ["src/**/*.vue"],
      preprocessStyles: true,
      isProduction:true,
    }),
    postcss({
      plugins: [autoprefixer()],
      inject: true,
      extensions:['.css','.less'],
      extract:'index.css'
    }),
    esbuild.default({
      target: "es2020",
      include: /\.[t]s?$/,
      exclude: [],
      sourcemap: false
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: true
    }),
    babel({
      babelHelpers: "runtime",
      include: ["src/**"],
      exclude: ["node_modules/**"],
      extensions: ['js', 'ts'],
      presets: [
        [
          "@babel/env",
          {
            useBuiltIns: "usage",
            corejs: "3.25"
          },
        ],
      ],
      plugins: [["@babel/plugin-transform-runtime"]],
    }),
    // terser(),
    // eslint(),
  ],
};
