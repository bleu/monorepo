"use client";

import Plot from "#/components/Plot";

/*
  Storing helper functions here for now since
  I'm not sure we're going to use them in the end 
*/

// /**
//  * Sorts data arrays by the values in the 'x' array.
//  *
//  * @param {Object} data - An object containing 'x' and 'y' arrays to be sorted.
//  * @returns {Array} An array containing sorted 'x' and corresponding 'y' arrays.
//  */
// function sortDataByX(data) {
//   // Get the indices of the 'x' array, maintaining the original order.
//   const sortedIndices = data["x"]
//     .map((_, index) => index)
//     .sort((a, b) => {
//       const xValueA = parseFloat(data["x"][a]); // Get the numeric value of 'x' at index 'a'.
//       const xValueB = parseFloat(data["x"][b]); // Get the numeric value of 'x' at index 'b'.
//       return xValueA - xValueB; // Compare the values for sorting in ascending order.
//     });
//     // Initialize an empty array to hold sorted 'x' and 'y' values.
//   const sortedX = [];
//   const sortedY = [];
//   // Loop through the sorted indices and extract corresponding 'x' and 'y' values.
//   for (const index of sortedIndices) {
//     // Push sorted 'x' and 'y' value into their respective arrays.
//     sortedX.push(data["x"][index]); 
//     sortedY.push(data["y"][index]);
//   }
//   // Return an array containing the sorted 'x' and 'y' arrays.
//   return [sortedX, sortedY];
// }
// /**
//  * Generates an RGBA color value based on the input string.
//  *
//  * @param {string} input - The input string used to generate the color.
//  * @returns {string} A string representing the RGBA color value.
//  */
// function generateRGBAFromString(input) {
//   // Calculate a hash using the input string to derive color components.
//   const hash = input.split("").reduce((hash, char) => {
//     return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
//   }, 0);
//   // Extract individual color components from the hash value.
//   const r = (hash & 0xff0000) >> 16;
//   const g = (hash & 0x00ff00) >> 8;
//   const b = hash & 0x0000ff;
//   const a = 1;
//   // Return the RGBA color value in the format "rgba(r, g, b, a)".
//   return `rgba(${r},${g},${b},${a})`;
// }

export default function TopPoolsChart({ roundId }: { roundId: string }) {
  const data = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: {
      color: [
        "rgba(227,176,10,1)",
        "rgba(234,157,219,1)",
        "rgba(26,51,112,1)",
        "rgba(220,118,103,1)",
        "rgba(138,42,4,1)",
        "rgba(170,93,232,1)",
        "rgba(248,224,240,1)",
        "rgba(50,220,250,1)",
        "rgba(46,68,220,1)",
        "rgba(46,68,220,1)",
        "rgba(252,101,62,1)",
        "rgba(141,115,128,1)",
        "rgba(202,164,107,1)",
        "rgba(202,164,107,1)",
        "rgba(179,162,239,1)",
        "rgba(183,43,247,1)",
        "rgba(140,38,142,1)",
      ],
    },
    orientation: "h",
    type: "bar",
    x: [
      "0.00",
      "0.01",
      "0.35",
      "0.50",
      "0.99",
      "1.10",
      "1.92",
      "3.48",
      "3.48",
      "3.53",
      "5.60",
      "9.60",
      "18.19",
      "18.62",
      "26.18",
      "39.03",
      "39.03",
    ],
    y: [
      "sNOTE-BPT",
      "B-50USDC-50WETH",
      "B-stETH-STABLE",
      "B-50VITA-50WETH",
      "80D2D-20USDC",
      "B-80GNO-20WETH",
      "50WETH-50AURA",
      "20WBTC-80BADGER",
      "20WBTC-80BADGER",
      "50COW-50GNO",
      "50COW-50WETH",
      "VBPT",
      "20WETH-80WNCG",
      "B-sdBAL-STABLE",
      "50DFX-50WETH",
      "USDC-PAL",
      "USDC-PAL",
    ],
  };

  // I used the following logic to create the above data
  // Though I'm aware it's we can't really trust that we
  // have the pools with the highest APR without iterating
  //  through the whole json file

  // const round = Round.getRoundByNumber(roundId);
  // const balPriceUSD = await getBALPriceByRound(round);
  // const data = {
  //   x: [],
  //   y: [],
  //   orientation: "h",
  //   marker: {
  //     color: [],
  //   },
  //   hovertemplate: "%{x:.2f}% APR<extra></extra>",
  //   type: "bar",
  // };
  // for (const gauge of votingGauges.slice(0, 50)) {
  //   const pool = new Pool(gauge.pool.id);
  //   const tvlPromise = BalancerAPI.getPoolTotalLiquidityUSD(
  //     pool.gauge?.network || 1,
  //     pool.id
  //   );
  //   const votingSharePromise = getPoolRelativeWeight(
  //     gauge.pool.id,
  //     round.endDate.getTime() / 1000
  //   );
  //   const [tvl, votingShare] = await Promise.all([
  //     tvlPromise,
  //     votingSharePromise,
  //   ]);
  //   const apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100;
  //   if (apr) {
  //     data["x"].push(apr.toFixed(2));
  //     data["y"].push(pool.symbol);
  //     data["marker"]["color"].push(generateRGBAFromString(pool.symbol));
  //   }
  //   if (data["y"].length > 16) {
  //     const [sortedX, sortedY] = sortDataByX(data);
  //     data["x"] = sortedX;
  //     data["y"] = sortedY;
  //     break;
  //   }
  // }

  return (
    <div className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        title="Top APR Pools"
        toolTip="Top pools with highest APR."
        data={[data]}
        layout={{
          barmode: "overlay",
          autosize: true,
          dragmode: false,
          xaxis: {
            title: `APR %`,
            fixedrange: true,
          },
          yaxis: { fixedrange: true },
        }}
      />
    </div>
  );
}
