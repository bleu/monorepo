/* eslint-disable no-console */
const isVerbose = process.argv.includes("-v");

export function logIfVerbose(message: unknown) {
  if (isVerbose) {
    console.log(message);
  }
}
