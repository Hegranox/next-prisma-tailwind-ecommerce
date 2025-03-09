// eslint.config.js (Flat Config)
const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": ts,
      react: react,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "no-html-link-for-pages": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
