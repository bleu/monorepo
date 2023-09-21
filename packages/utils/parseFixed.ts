function getMultiplier(decimals: string | number) {
  if (typeof decimals !== "number") {
    try {
      decimals = parseInt(decimals);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Invalid decimal size: ${decimals}`);
    }
  }

  if (
    typeof decimals === "number" &&
    decimals >= 0 &&
    decimals <= 256 &&
    !(decimals % 1)
  ) {
    return "1" + "0".repeat(decimals);
  }

  throw new Error("Invalid decimal size: " + decimals);
}

export default function parseFixed(value: string, decimals = 0) {
  const multiplier = getMultiplier(decimals);

  if (typeof value !== "string" || !/^-?[0-9.]+$/.test(value)) {
    throw new Error("Invalid decimal value: " + value);
  }

  const negative = value[0] === "-";
  if (negative) {
    value = value.substring(1);
  }

  if (value === ".") {
    throw new Error("Missing value: " + value);
  }

  const comps = value.split(".");
  if (comps.length > 2) {
    throw new Error("Too many decimal points: " + value);
  }

  const whole = comps[0] || "0";
  let fraction = comps[1] || "0";

  while (fraction[fraction.length - 1] === "0") {
    fraction = fraction.substring(0, fraction.length - 1);
  }

  if (fraction.length > multiplier.length - 1) {
    throw new Error("Fractional component exceeds decimals");
  }

  if (fraction === "") {
    fraction = "0";
  }

  while (fraction.length < multiplier.length - 1) {
    fraction += "0";
  }

  const wholeValue = BigInt(whole);
  const fractionValue = BigInt(fraction);

  let result = BigInt(wholeValue * BigInt(multiplier) + fractionValue);

  if (negative) {
    result = -result;
  }

  return result;
}
