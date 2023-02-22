module.exports = {
  parserOptions: {
    sourceType: "module",
  },
  env: { es6: true },
  plugins: ["simple-import-sort", "import"],
  extends: [
    "next",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  settings: {
    next: {
      rootDir: ["packages/*/"],
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/ignore": ["react"],
    "import/resolver": {
      typescript: {
        project: ["packages/*/tsconfig.json"],
      },
    },
  },
  ignorePatterns: ["packages/next-app/src/wagmi/generated.ts"],
  rules: {
    "import/no-named-as-default": "off",
    "no-console": "error",
    "import/namespace": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "off",
    "import/no-named-as-default-member": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
  },
};
