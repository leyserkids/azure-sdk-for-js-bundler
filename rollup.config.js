import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import shim from "rollup-plugin-shim";
import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";

const defaultPlugins = [
  shim({
    fs: `
    export function stat() { }
    export function createReadStream() { }
    export function createWriteStream() { }
  `,
    os: `
    export var type = 1;
    export var release = 1;
  `,
    util: `
    export function promisify() { }
  `,
  }),
  resolve({
    preferBuiltins: false,
    mainFields: ["module", "browser"],
  }),
  cjs({
    namedExports: {
      events: ["EventEmitter"],
      "@opentelemetry/api": ["CanonicalCode", "SpanKind", "TraceFlags"],
    },
  }),
  json(),
  typescript(),
];

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.js",
      format: "iife",
      name: "main",
    },
    plugins: defaultPlugins,
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/bundle.min.js",
      format: "iife",
      name: "main",
    },
    plugins: [...defaultPlugins, uglify()],
  },
];
