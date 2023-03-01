// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-vault/contracts/Vault.sol";
import "@balancer-labs/v2-pool-utils/contracts/test/MockBasePool.sol";

import {Test} from "forge-std/Test.sol";

contract MockPoolMetadataRegistry is PoolMetadataRegistry {
    constructor(IVault vault) PoolMetadataRegistry(vault) {}

    function isPoolRegistered(bytes32 poolId) public view returns (bool) {
        return _isPoolRegistered(poolId);
    }

    function isPoolOwner(bytes32 poolId) public view returns (bool) {
        return _isPoolOwner(poolId);
    }
}

contract PoolMetadataRegistryTest is IPoolMetadataRegistry, Test {
    MockPoolMetadataRegistry _poolMetadataRegistry;
    IVault private _vault;
    MockBasePool private _basePool;

    string private constant _testMetadataCID = "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR";

    function setUp() external {
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);

        IERC20[] memory tokens = new IERC20[](2);

        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }

        address[] memory assetManagers = new address[](2);

        _basePool = new MockBasePool(
            _vault,
            IVault.PoolSpecialization.GENERAL,
            'MockBasePool',
            'MBP',
            tokens,
            assetManagers,
            1e16,
            0,
            0,
            address(15) // 0x00..00f
        );

        _poolMetadataRegistry = new MockPoolMetadataRegistry(_vault);
    }

    function testIsPoolRegistered() public {
        bool isPool = _poolMetadataRegistry.isPoolRegistered(_basePool.getPoolId());

        assertTrue(isPool);
    }

    function testIsPoolNotRegistered() public {
        bool isPool = _poolMetadataRegistry.isPoolRegistered(0);

        assertFalse(isPool);
    }

    function testIsPoolOwner() public {
        assertFalse(_poolMetadataRegistry.isPoolOwner(_basePool.getPoolId()));

        vm.startPrank(address(15));
        assertTrue(_poolMetadataRegistry.isPoolOwner(_basePool.getPoolId()));
        vm.stopPrank();
    }

    function testIfUpdatePoolMetadataRevert() public {
        vm.expectRevert("Pool not registered");
        _poolMetadataRegistry.setPoolMetadata(0x0, _testMetadataCID);

        // vm.expectRevert();
        // _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);
    }

    function testMetadataSetter() public {
        vm.startPrank(address(15));
        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);

        assertEq(_poolMetadataRegistry.poolIdMetadataCIDMap(_basePool.getPoolId()), _testMetadataCID);
        vm.stopPrank();
    }

    function testMetadataSetterEmitsEvent() public {
        vm.startPrank(address(15));
        vm.expectEmit(true, false, true, true, address(_poolMetadataRegistry));
        emit PoolMetadataUpdated(_basePool.getPoolId(), _testMetadataCID);

        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);
        vm.stopPrank();
    }
}
