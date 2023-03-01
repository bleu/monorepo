// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IProtocolFeePercentagesProvider.sol";
import "@balancer-labs/v2-vault/contracts/Vault.sol";
import "@balancer-labs/v2-pool-utils/contracts/test/MockBasePool.sol";
import "@balancer-labs/v2-pool-utils/contracts/lib/PoolRegistrationLib.sol";
import "balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPool.sol";
import "balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPool.sol";
import "balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPoolFactory.sol";
import "balancer-v2-monorepo/pkg/standalone-utils/contracts/ProtocolFeePercentagesProvider.sol";
import "balancer-v2-monorepo/pkg/pool-weighted/contracts/test/MockWeightedPool.sol";
import "balancer-v2-monorepo/pkg/pool-utils/contracts/test/MockRateProvider.sol";
// import "balancer-v2-monorepo/pkg/vault/contracts/ProtocolFeesCollector.sol";

import {Test} from "forge-std/Test.sol";

contract PoolMetadataRegistryTest is Test {
    PoolMetadataRegistry _poolMetadataRegistry;
    IVault private _vault;
    bytes32 poolId;
    MockBasePool private _basePool;
    MockBasePool private  _myPool;
    ProtocolFeePercentagesProvider private _protocolFeeProvider;
    ProtocolFeesCollector private _feesCollector;

    function setUp() external {
        // To continue this setUp, we'll probably need to do the same done in
        // lib/balancer-v2-monorepo/pvt/helpers/src/models/vault/VaultDeployer.ts
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);
        _feesCollector = new ProtocolFeesCollector(_vault);

        IERC20[] memory tokens = new IERC20[](2);

        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }

        address[] memory assetManagers = new address[](2);

        _poolMetadataRegistry = new PoolMetadataRegistry(_vault);

        uint256[] memory normalizedWeights = new uint256[](tokens.length);

        for (uint256 i = 0; i < normalizedWeights.length; i++) {
            normalizedWeights[i] = uint256(5e17);
        }

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


        _myPool = new MockBasePool(
            _vault,
            IVault.PoolSpecialization.GENERAL,
            'MockBasePool',
            'MBP',
            tokens,
            assetManagers,
            1e16,
            0,
            0,
            address(this)
        );

    }

    function testIsPoolRegistered() public {
        emit log_named_bytes32("poolId = ", _basePool.getPoolId());
        bool isPool = _poolMetadataRegistry.isPoolRegistered(_basePool.getPoolId());
        emit log_named_string("is a Pool?", isPool ? "Yes" : "No");

        assertTrue(isPool);
    }

    function testIsPoolNotRegistered() public {
        emit log_named_bytes32("poolId = ", 0);
        bool isPool = _poolMetadataRegistry.isPoolRegistered(0);
        emit log_named_string("is a Pool?", isPool ? "Yes" : "No");

        assertFalse(isPool);
    }

    function testIsPoolOwner() public {
        bool isPoolOwner = _poolMetadataRegistry.isPoolOwner(_basePool.getPoolId());
        assertFalse(isPoolOwner);

        bool amIPoolOwner = _poolMetadataRegistry.isPoolOwner(_myPool.getPoolId());
        assertTrue(amIPoolOwner);
    }
}
