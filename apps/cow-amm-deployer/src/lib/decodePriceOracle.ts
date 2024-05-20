import { Address, decodeAbiParameters } from "viem";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { uniswapV2PairAbi } from "./abis/uniswapV2Pair";
import { UNISWAP_V2_FACTORY_ADDRESS } from "./contracts";
import { PRICE_ORACLES, PriceOracleData } from "./types";

export async function decodePriceOracleWithData({
  address,
  priceOracleData,
  chainId,
}: {
  address: Address;
  priceOracleData: `0x${string}`;
  chainId: ChainId;
}): Promise<[PRICE_ORACLES, PriceOracleData]> {
  const lowerCaseAddress = address.toLowerCase();
  const publicClient = publicClientsFromIds[chainId];

  if (
    [
      "0xad37fe3ddedf8cdee1022da1b17412cfb6495596",
      "0xd3a84895080609e1163c80b2bd65736db1b86bec",
      "0xb2efb68ab1798c04700afd7f625c0ffbde974756",
    ].includes(lowerCaseAddress)
  ) {
    const [balancerPoolId] = decodeAbiParameters(
      [{ type: "bytes32", name: "poolId" }],
      priceOracleData,
    );
    return [PRICE_ORACLES.BALANCER, { balancerPoolId: balancerPoolId }];
  }

  if (
    [
      "0x573cc0c800048f94e022463b9214d92c2d65e97b",
      "0xe089049027b95c2745d1a954bc1d245352d884e9",
      "0xe45ae383873f9f7e3e42deb12886f481999696b6",
    ].includes(lowerCaseAddress)
  ) {
    const [pairAddress] = decodeAbiParameters(
      [{ type: "address", name: "pairAddress" }],
      priceOracleData,
    );
    const pairFactory = await publicClient.readContract({
      address: pairAddress as Address,
      abi: uniswapV2PairAbi,
      functionName: "factory",
      args: [],
    });
    if (
      pairFactory.toLowerCase() === UNISWAP_V2_FACTORY_ADDRESS.toLowerCase()
    ) {
      return [PRICE_ORACLES.UNI, { uniswapV2PairAddress: pairAddress }];
    }
    return [PRICE_ORACLES.SUSHI, { sushiSwapPairAddress: pairAddress }];
  }

  if (
    [
      "0xbd91a72dc3d9b5d9b16ee8638da1fc65311bd90a",
      "0xf54c4bcc34a8750382b8fb0f0ec6f1a6c785af9c",
      "0x79200763b5bc95d8d6a3b53be1e9a494bc301940",
    ].includes(lowerCaseAddress)
  ) {
    const [chainlinkPriceFeed0, chainlinkPriceFeed1, _timeThreshold, _backoff] =
      decodeAbiParameters(
        [
          { type: "address", name: "priceFeed0" },
          { type: "address", name: "priceFeed1" },
          { type: "uint256", name: "timeThreshold" },
          { type: "uint256", name: "backoff" },
        ],
        priceOracleData,
      );
    return [
      PRICE_ORACLES.CHAINLINK,
      {
        chainlinkPriceFeed0,
        chainlinkPriceFeed1,
      },
    ];
  }
  return [PRICE_ORACLES.CUSTOM, {}];
}
