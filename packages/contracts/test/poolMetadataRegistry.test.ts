import  StablePoolDeployer from "@balancer-labs/v2-helpers/src/models/pools/stable/StablePoolDeployer"
import TokenList from "@balancer-labs/v2-helpers/src/models/tokens/TokenList";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("PoolMetadataRegistry", function () {
  it("Should return name PoolMetadataRegistry", async function () {
    const PoolMetadataRegistry = await ethers.getContractFactory(
      "PoolMetadataRegistry"
    );

    const tokens = await TokenList.create(6, { sorted: true });

    const pool = await StablePoolDeployer.deploy({tokens, mockedVault: true})
    
    const registry = await PoolMetadataRegistry.deploy(
      pool.vault.address
    );

    await registry.deployed();

    expect(await registry.isPoolRegistered(pool.address)).to.equal(true);
  });
});
