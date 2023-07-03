const path = require("path");

module.exports = {
  root: true,
  plugins: ["prettier"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname)],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:storybook/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "eslint-config-prettier",
    "prettier",
    "plugin:storybook/recommended",
  ],
  rules: {
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/semi": ["error"],
    "comma-dangle": ["error", "only-multiline"],
    "no-unused-vars": "off",
    "object-curly-spacing": ["error", "always"],
    "prefer-const": "error",
    quotes: ["error", "double"],
    "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
    "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
    "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
    "react/react-in-jsx-scope": "off",
    semi: "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
  },
};
