import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";

export default async function example(
  _params: unknown,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const ethers = hre.ethers;

  const [account] = await ethers.getSigners();

  // eslint-disable-next-line no-console
  console.log(
    `Balance for 1st account ${await account.getAddress()}: ${await account.getBalance()}`
  );
}
