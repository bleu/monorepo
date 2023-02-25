import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers"
import "@typechain/hardhat";
import "hardhat-preprocessor";
import 'hardhat-dependency-compiler'

import fs from "fs";
import { HardhatUserConfig, task } from "hardhat/config";

import example from "./tasks/example";

function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => line.trim().split("="));
}

task("example", "Example task").setAction(example);

const config: HardhatUserConfig = {
  solidity: {
    version:  '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    }
  },
  defaultNetwork: 'hardhat',
  paths: {
    sources: "./src", // Use ./src rather than ./contracts as Hardhat expects
    cache: "./cache_hardhat", // Use a different cache for Hardhat than Foundry
  },
  // This fully resolves paths for imports in the ./lib directory for Hardhat
  preprocess: {
    eachLine: (_hre: unknown) => ({
      transform: (line: string) => {
        if (line.match(/^\s*import /i)) {
          if (line.includes("@balancer-labs")) return line;

          getRemappings().forEach(([find, replace]) => {
            if (line.match(find)) {
              line = line.replace(find, replace);
            }
          });
        }
        return line;
      },
    }),
  },
  dependencyCompiler: {
    paths: [
      "balancer-v2-monorepo/pkg/vault/contracts/test/MockBasicAuthorizer.sol",
      "balancer-v2-monorepo/pkg/pool-utils/contracts/test/MockVault.sol",
      "balancer-v2-monorepo/pkg/liquidity-mining/contracts/admin/AuthorizerAdaptor.sol",
      "balancer-v2-monorepo/pkg/liquidity-mining/contracts/admin/AuthorizerAdaptorEntrypoint.sol",
      "balancer-v2-monorepo/pkg/standalone-utils/contracts/ProtocolFeePercentagesProvider.sol",
      "balancer-v2-monorepo/pkg/vault/contracts/authorizer/TimelockAuthorizer.sol",
      "balancer-v2-monorepo/pkg/pool-stable/contracts/test/MockComposableStablePool.sol",
      "@balancer-labs/v2-solidity-utils/contracts/test/TestToken.sol",
      "balancer-v2-monorepo/pkg/standalone-utils/contracts/test/TestWETH.sol"
    ],
  }
};

export default config;
