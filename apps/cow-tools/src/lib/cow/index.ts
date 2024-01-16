import { gnosis, goerli } from "viem/chains";

const COW_API_BASE_URL = "https://api.cow.fi/";

export const COW_API_URL_BY_CHAIN_ID = {
  [gnosis.id]: COW_API_BASE_URL + "xdai",
  [goerli.id]: COW_API_BASE_URL + "goerli",
};
