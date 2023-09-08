/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "type", "parent", "sibling"],
        warnOnUnassignedImports: true,
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          orderImportKind: "asc"
        }
      }
    ],
    "import/no-unresolved": "error"
  },
  env: {
    es2021: true,
    commonjs: true
  }
};
