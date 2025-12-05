import eslint from "eslint";
const { defineConfig } = eslint;
import js from "@eslint/js";
import globals from "globals";

export default defineConfig({
  files: ["**/*.js"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    js,
  },
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
    "no-console": "off",
  },
  extends: ["plugin:js/recommended"],
});
