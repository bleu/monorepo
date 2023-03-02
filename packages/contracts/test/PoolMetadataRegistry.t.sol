// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IVault.sol";
import "balancer-v2-monorepo/pkg/vault/contracts/Vault.sol";
import "balancer-v2-monorepo/pkg/pool-utils/contracts/test/MockBasePool.sol";

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
    address private constant _poolOwner = address(15);

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
            _poolOwner
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

    function testIsPoolOwnerReturnsTrueWhenOwner() public {
        vm.startPrank(_poolOwner);
        assertTrue(_poolMetadataRegistry.isPoolOwner(_basePool.getPoolId()));
        vm.stopPrank();
    }

    function testIsPoolOwnerFalseWhenNotOwner() public {
        assertFalse(_poolMetadataRegistry.isPoolOwner(_basePool.getPoolId()));
    }

    function testIfsetPoolMetadataRevertWhePoolNotRegistered() public {
        vm.expectRevert("Pool not registered");

        _poolMetadataRegistry.setPoolMetadata(0x0, _testMetadataCID);
    }

    function testIfsetPoolMetadataRevertWhenNotOwner() public {
        bytes32 poolId = _basePool.getPoolId();
        vm.expectRevert("Caller is not the owner");

        _poolMetadataRegistry.setPoolMetadata(poolId, _testMetadataCID);
    }

    function testMetadataSetter() public {
        vm.startPrank(_poolOwner);
        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);

        assertEq(_poolMetadataRegistry.poolIdMetadataCIDMap(_basePool.getPoolId()), _testMetadataCID);
        vm.stopPrank();
    }

    function testMetadataSetterEmitsEvent() public {
        vm.startPrank(_poolOwner);
        vm.expectEmit(true, false, false, true, address(_poolMetadataRegistry));
        emit PoolMetadataUpdated(_basePool.getPoolId(), _testMetadataCID);

        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);
        vm.stopPrank();
    }
}
