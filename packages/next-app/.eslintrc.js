module.exports = {
  extends: [
    "@balancer-pool-metadata/eslint-config",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  ignorePatterns: ["src/wagmi/generated.ts"],
  rules: {
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-negative-arbitrary-values": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/migration-from-tailwind-2": "warn",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-custom-classname": "error",
    "tailwindcss/no-contradicting-classname": "error",
  },
};
