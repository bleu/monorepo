// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "balancer-v2-monorepo/pkg/vault/contracts/Vault.sol";
import "balancer-v2-monorepo/pkg/pool-utils/contracts/test/MockBasePool.sol";
import "balancer-v2-monorepo/pkg/vault/contracts/test/MockBasicAuthorizer.sol";
import "balancer-v2-monorepo/pkg/vault/contracts/test/MockAuthenticatedContract.sol";
import "forge-std/console.sol";

import {Test} from "forge-std/Test.sol";

contract MockPoolMetadataRegistry is PoolMetadataRegistry {
    constructor(IVault vault) PoolMetadataRegistry(vault) {}

    function isPoolRegistered(bytes32 poolId) public view returns (bool) {
        return _isPoolRegistered(poolId);
    }
}

contract PoolMetadataRegistryTest is IPoolMetadataRegistry, Test {
    MockPoolMetadataRegistry _poolMetadataRegistry;
    MockBasicAuthorizer private _authorizer;
    MockAuthenticatedContract private _authenticated;
    IVault private _vault;
    MockBasePool private _basePool;
    MockBasePool private _delegatedBasePool;
    address private constant _poolOwner = address(15);

    string private constant _testMetadataCID = "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR";
    address internal constant _DELEGATE_OWNER = 0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B;
    address DAOmultisig = address(uint160(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)))));

    function setUp() external {
        _authorizer = new MockBasicAuthorizer();
        _vault = new Vault(_authorizer, IWETH(0), 0, 0);
        _authenticated = new MockAuthenticatedContract(_vault);

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

        _delegatedBasePool = new MockBasePool(
            _vault,
            IVault.PoolSpecialization.GENERAL,
            'MockBasePool',
            'MBP',
            tokens,
            assetManagers,
            1e16,
            0,
            0,
            _DELEGATE_OWNER
        );

        _poolMetadataRegistry = new MockPoolMetadataRegistry(_vault);

        // Compute the "setPoolMetadata(bytes32,string)" actionId
        bytes32 actionIdDisambiguator = bytes32(uint256(address(_poolMetadataRegistry)));
        bytes4 selector = _poolMetadataRegistry.setPoolMetadata.selector; // 0xf44f9f15
        bytes32 setPoolMetadataActionId = keccak256(abi.encodePacked(actionIdDisambiguator, selector));

        // Grant the "setPoolMetadata(bytes32,string)" role to the DAO multisig
        _authorizer.grantRole(setPoolMetadataActionId, DAOmultisig);
    }

    function test_isPoolRegistered_True_When_PoolExists() public {
        bool isPool = _poolMetadataRegistry.isPoolRegistered(_basePool.getPoolId());

        assertTrue(isPool);
    }

    function test_isPoolRegistered_False_When_0() public {
        bool isPool = _poolMetadataRegistry.isPoolRegistered(0);

        assertFalse(isPool);
    }

    function test_setPoolMetadata_RevertIf_PoolNotRegistered() public {
        vm.expectRevert("Pool not registered");

        _poolMetadataRegistry.setPoolMetadata(0x0, _testMetadataCID);
    }

    function test_setPoolMetadata_RevertIf_SenderNotOwner() public {
        bytes32 poolId = _basePool.getPoolId();

        vm.expectRevert("sender not allowed");

        _poolMetadataRegistry.setPoolMetadata(poolId, _testMetadataCID);
    }

    function test_setPoolMetadata_Success() public {
        vm.startPrank(_poolOwner);
        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);

        assertEq(_poolMetadataRegistry.poolIdMetadataCIDMap(_basePool.getPoolId()), _testMetadataCID);
        vm.stopPrank();
    }

    function test_setBatchPoolMetadata_Success() public {
        vm.startPrank(_poolOwner);
        uint256 maxArraySize = 2 ** 11;

        bytes32[] memory poolIds = new bytes32[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            poolIds[i] = _basePool.getPoolId();
        }

        string[] memory CIDs = new string[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            CIDs[i] = _testMetadataCID;
        }

        _poolMetadataRegistry.setBatchPoolMetadata(poolIds, CIDs);

        assertEq(_poolMetadataRegistry.poolIdMetadataCIDMap(_basePool.getPoolId()), _testMetadataCID);
        vm.stopPrank();
    }

    function test_setBatchPoolMetadata_RevertIf_NotOwnerOfSomePool() public {
        vm.startPrank(_poolOwner);
        uint256 maxArraySize = 2 ** 11;

        bytes32[] memory poolIds = new bytes32[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            poolIds[i] = i % 2 == 0 ? _basePool.getPoolId() : _delegatedBasePool.getPoolId();
        }

        string[] memory CIDs = new string[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            CIDs[i] = _testMetadataCID;
        }

        vm.expectRevert("sender not allowed");

        _poolMetadataRegistry.setBatchPoolMetadata(poolIds, CIDs);

        vm.stopPrank();
    }

    function test_setBatchPoolMetadata_RevertIf_ArrayMismatch() public {
        vm.startPrank(_poolOwner);
        uint256 maxArraySize = 2 ** 10;

        bytes32[] memory poolIds = new bytes32[](maxArraySize + 1);
        for (uint256 i = 0; i < maxArraySize + 1; i++) {
            poolIds[i] = _basePool.getPoolId();
        }

        string[] memory CIDs = new string[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            CIDs[i] = _testMetadataCID;
        }

        vm.expectRevert("Array size mismatch");

        _poolMetadataRegistry.setBatchPoolMetadata(poolIds, CIDs);

        vm.stopPrank();
    }

    function test_setBatchMetadata_RevertIf_ArrayTooLarge() public {
        vm.startPrank(_poolOwner);
        uint256 maxArraySize = 2 ** 12;

        bytes32[] memory poolIds = new bytes32[](maxArraySize + 1);
        for (uint256 i = 0; i < maxArraySize + 1; i++) {
            poolIds[i] = _basePool.getPoolId();
        }

        string[] memory CIDs = new string[](maxArraySize);
        for (uint256 i = 0; i < maxArraySize; i++) {
            CIDs[i] = _testMetadataCID;
        }

        vm.expectRevert("Array size exceeds the limit");

        _poolMetadataRegistry.setBatchPoolMetadata(poolIds, CIDs);

        vm.stopPrank();
    }

    function test_setPoolMetadata_SuccessWhen_DAOmultisig() public {
        vm.startPrank(DAOmultisig);
        _poolMetadataRegistry.setPoolMetadata(_delegatedBasePool.getPoolId(), _testMetadataCID);

        assertEq(_poolMetadataRegistry.poolIdMetadataCIDMap(_delegatedBasePool.getPoolId()), _testMetadataCID);
        vm.stopPrank();
    }

    function test_setPoolMetadata_RevertIf_DAONotDelegatedOwner() public {
        bytes32 poolId = _basePool.getPoolId();
        vm.startPrank(DAOmultisig);

        vm.expectRevert("sender not allowed");

        _poolMetadataRegistry.setPoolMetadata(poolId, _testMetadataCID);
        vm.stopPrank();
    }

    function test_setPoolMetadata_EmitsEvent() public {
        vm.startPrank(_poolOwner);
        vm.expectEmit(true, false, false, true, address(_poolMetadataRegistry));
        emit PoolMetadataUpdated(_basePool.getPoolId(), _testMetadataCID);

        _poolMetadataRegistry.setPoolMetadata(_basePool.getPoolId(), _testMetadataCID);
        vm.stopPrank();
    }
}
