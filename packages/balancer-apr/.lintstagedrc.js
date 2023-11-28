/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const micromatch = require("micromatch");

module.exports = {
  "**/*.ts?(x)": () => "tsc -p tsconfig.json --noEmit --skipLibCheck",
  "*.{md,html,mjml,json,graphql,yml,css,scss}": "prettier --write",
  "*.{js,jsx,ts,tsx}": (files) => {
    const match = micromatch.not(files, "**/src/lib/__generated__/*.ts");

    return `eslint ${match.join(" ")} --fix`;
  },
};
