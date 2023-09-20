/* eslint-env node */

module.exports = {
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit --skipLibCheck",
  "*.{md,html,mjml,json,graphql,yml,css,scss}": "prettier --write",
  "*.{js,jsx,ts,tsx}": "eslint -c ../../../.eslintrc.js --fix --no-ignore --max-warnings 0",
};
