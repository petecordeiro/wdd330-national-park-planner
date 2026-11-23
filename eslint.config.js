import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["build/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["js/**/*.{js,mjs}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["scripts/*.mjs"],
    languageOptions: { globals: globals.node },
  },
];
