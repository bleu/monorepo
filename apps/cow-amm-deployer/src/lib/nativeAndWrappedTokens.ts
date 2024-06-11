import { arbitrum, gnosis, mainnet, sepolia } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

import { cowprotocolTokenLogoUrl } from "./cowprotocolTokenLogoUrl";
import { TokenWithLogo } from "./tokenWithLogo";

export const NATIVE_CURRENCY_ADDRESS =
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const DEFAULT_NATIVE_DECIMALS = 18;
const WETH9_MAINNET_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ETH_LOGO_URL = cowprotocolTokenLogoUrl(
  WETH9_MAINNET_ADDRESS.toLowerCase(),
  mainnet.id,
);

export const WRAPPED_NATIVE_CURRENCIES: Record<ChainId, TokenWithLogo> = {
  [mainnet.id]: new TokenWithLogo(
    ETH_LOGO_URL,
    mainnet.id,
    WETH9_MAINNET_ADDRESS,
    DEFAULT_NATIVE_DECIMALS,
    "WETH",
    "Wrapped Ether",
  ),
  [gnosis.id]: new TokenWithLogo(
    undefined,
    gnosis.id,
    "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    DEFAULT_NATIVE_DECIMALS,
    "WXDAI",
    "Wrapped XDAI",
  ),
  [arbitrum.id]: new TokenWithLogo(
    ETH_LOGO_URL,
    arbitrum.id,
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    DEFAULT_NATIVE_DECIMALS,
    "WETH",
    "Wrapped Ether",
  ),
  [sepolia.id]: new TokenWithLogo(
    ETH_LOGO_URL,
    sepolia.id,
    "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    DEFAULT_NATIVE_DECIMALS,
    "WETH",
    "Wrapped Ether",
  ),
};

export const NATIVE_CURRENCIES: Record<ChainId, TokenWithLogo> = {
  [mainnet.id]: new TokenWithLogo(
    undefined,
    mainnet.id,
    NATIVE_CURRENCY_ADDRESS,
    DEFAULT_NATIVE_DECIMALS,
    "ETH",
    "Ether",
  ),
  [gnosis.id]: new TokenWithLogo(
    undefined,
    gnosis.id,
    NATIVE_CURRENCY_ADDRESS,
    DEFAULT_NATIVE_DECIMALS,
    "xDAI",
    "xDAI",
  ),
  [arbitrum.id]: new TokenWithLogo(
    undefined,
    arbitrum.id,
    NATIVE_CURRENCY_ADDRESS,
    DEFAULT_NATIVE_DECIMALS,
    "ETH",
    "Ether",
  ),
  [sepolia.id]: new TokenWithLogo(
    undefined,
    sepolia.id,
    NATIVE_CURRENCY_ADDRESS,
    DEFAULT_NATIVE_DECIMALS,
    "ETH",
    "Ether",
  ),
};

export const WETH_MAINNET = WRAPPED_NATIVE_CURRENCIES[mainnet.id];
export const WXDAI = WRAPPED_NATIVE_CURRENCIES[gnosis.id];
export const WETH_SEPOLIA = WRAPPED_NATIVE_CURRENCIES[sepolia.id];
