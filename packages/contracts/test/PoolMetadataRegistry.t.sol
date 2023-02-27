// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";

import "balancer-v2-monorepo/pkg/vault/contracts/test/MockBasicAuthorizer.sol";
import "balancer-v2-monorepo/pkg/vault/contracts/test/MockPool.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-vault/contracts/Vault.sol";
import "@balancer-labs/v2-pool-utils/contracts/lib/PoolRegistrationLib.sol";

import {Test} from "forge-std/Test.sol";

interface IPool {
    function getOwner() external view returns (address);
}

contract PoolMetadataRegistryTest is Test {
    PoolMetadataRegistry poolMetadataRegistry;
    IVault private _vault;

    bytes32 poolId;

    function setUp() external {
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);

        IERC20[] memory tokens = new IERC20[](10);
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }
        address[] memory assetManagers = new address[](10);

        poolId = PoolRegistrationLib.registerComposablePool(
                                            _vault, 
                                            IVault.PoolSpecialization.GENERAL, 
                                            tokens, 
                                            assetManagers);

        poolMetadataRegistry = new PoolMetadataRegistry(_vault);
    }

    function testIsPoolRegistered() public {
        emit log_named_bytes32("poolId = ", poolId);
        bool isPool = poolMetadataRegistry.isPoolRegistered(poolId);
        emit log_named_string("is a Pool?", isPool ? "Yes" : "No");

        assertTrue(isPool);
    }

    function testIsPoolNotRegistered() public {
        emit log_named_bytes32("poolId = ", 0);
        bool isPool = poolMetadataRegistry.isPoolRegistered(0);
        emit log_named_string("is a Pool?", isPool ? "Yes" : "No");

        assertFalse(isPool);
    }

    function testIsPoolOwner() public {

        (address poolAddress,) = _vault.getPool(poolId);
        emit log_named_address('Pool Address... ', poolAddress);

        address owner = IPool(poolAddress).getOwner();

        emit log_named_address('Address pool', owner );

    }

}
