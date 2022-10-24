import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from '@rollup/plugin-replace';
import vue from "@vitejs/plugin-vue2";
import autoprefixer from "autoprefixer";
import glob from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
  .filter(id=>id!='vue')
  .join("|");
module.exports = {
  input:  Object.fromEntries(
    glob.sync('src/**/!(*.d).ts').map(file => [
      // This remove `src/` as well as the file extension from each file, so e.g.
      // src/nested/foo.js becomes nested/foo
      path.relative('src', file.slice(0, file.length - path.extname(file).length)),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, import.meta.url))
    ])
  ),
  external: (id) => {
    console.log(id)
    /**
     * 安装的 peerDependencies 包名必须写在这里，否则会打包到 bundle
     * 1. babel 的辅助函数需要排除
     * 2. core-js polyfill 垫片相关,此处使用全局污染的方式，避免跟业务方冲突
     *
     * */
    const reg = new RegExp(`(${externalDeps})`);
    if (/^vue/.test(id) ) {
      return true;
    }
    return reg.test(id);
  },
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: false,
    preserveModules:true,
    preserveModulesRoot: 'src',
    entryFileNames: "[name].js"
  },
  plugins: [
    cleaner({ targets: ["dist"] }),
    resolve(),
    commonjs(),
    vue({
      include: ["src/**/*.vue"],
      isProduction:true,
    }),
    postcss({
      plugins: [autoprefixer()],
      inject: true,
      extensions:['.css','.less'],
      extract:'style/index.css',
    
    }),
    esbuild.default({
      target: "es2020",
      include: /\.[t]s?$/,
      exclude: [],
      sourcemap: false
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true
    }),
    // babel({
    //   babelHelpers: "runtime",
    //   include: ["src/**"],
    //   exclude: ["node_modules/**"],
    //   extensions: ['js', 'ts'],
    //   presets: [
    //     [
    //       "@babel/env",
    //       {
    //         useBuiltIns: "usage",
    //         corejs: "3.25"
    //       },
    //     ],
    //   ],
    //   plugins: [["@babel/plugin-transform-runtime"]],
    // }),
    // terser(),
    // eslint(),
  ],
};
