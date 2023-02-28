// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "forge-std/Script.sol";
import "../src/PoolMetadataRegistry.sol";

contract Deploy is Script {
    IVault public immutable vault = IVault(0xBA12222222228d8Ba445958a75a0704d566BF2C8);

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new PoolMetadataRegistry(vault);

        vm.stopBroadcast();
    }
}
