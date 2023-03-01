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

contract MockPoolMetadataRegistry is PoolMetadataRegistry {
    constructor(IVault vault) PoolMetadataRegistry(vault) {}

    function isPoolRegistered(bytes32 poolId) public view returns (bool) {
        return _isPoolRegistered(poolId);
    }
}

contract PoolMetadataRegistryTest is IPoolMetadataRegistry, Test {
    MockPoolMetadataRegistry poolMetadataRegistry;
    IVault private _vault;

    string private constant _testMetadataCID = "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR";

    bytes32 poolId;

    function setUp() external {
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);

        IERC20[] memory tokens = new IERC20[](10);
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }
        address[] memory assetManagers = new address[](10);

        poolId =
            PoolRegistrationLib.registerComposablePool(_vault, IVault.PoolSpecialization.GENERAL, tokens, assetManagers);

        poolMetadataRegistry = new MockPoolMetadataRegistry(_vault);
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

    function testIfUpdatePoolMetadataRevert() public {
        vm.expectRevert("Pool not registered");

        poolMetadataRegistry.setPoolMetadata(0x0, _testMetadataCID);
    }

    function testMetadataSetter() public {
        poolMetadataRegistry.setPoolMetadata(poolId, _testMetadataCID);

        assertEq(poolMetadataRegistry.poolIdMetadataCIDMap(poolId), _testMetadataCID);
    }

    function testMetadataSetterEmitsEvent() public {
        vm.expectEmit(true, false, false, true, address(poolMetadataRegistry));
        emit PoolMetadataUpdated(poolId, _testMetadataCID);

        poolMetadataRegistry.setPoolMetadata(poolId, _testMetadataCID);
    }
}
