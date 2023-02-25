import { expect } from "chai";
import { ethers } from "hardhat";

describe("PoolMetadataRegistry", function () {
  it("Should return name PoolMetadataRegistry", async function () {
    const PoolMetadataRegistry = await ethers.getContractFactory(
      "PoolMetadataRegistry"
    );

    const registry = await PoolMetadataRegistry.deploy(
      "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
    );
    await registry.deployed();

    expect(await registry.isPoolRegistered("0")).to.equal(true);
  });
});
