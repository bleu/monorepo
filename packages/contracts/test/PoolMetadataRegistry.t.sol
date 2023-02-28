// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IProtocolFeePercentagesProvider.sol";
import "@balancer-labs/v2-vault/contracts/Vault.sol";
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
    PoolMetadataRegistry poolMetadataRegistry;
    IVault private _vault;
    bytes32 poolId;
    MockWeightedPool private _weightedPool;
    ProtocolFeePercentagesProvider private _protocolFeeProvider;
    ProtocolFeesCollector private _feesCollector;
    address fakeOwner = address(11);

    function setUp() external {
        // To continue this setUp, we'll probably need to do the same done in
        // lib/balancer-v2-monorepo/pvt/helpers/src/models/vault/VaultDeployer.ts
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);
        _feesCollector = new ProtocolFeesCollector(_vault);

        _feesCollector.setSwapFeePercentage(50e16);
        _feesCollector.setFlashLoanFeePercentage(1e16);
        _protocolFeeProvider = new ProtocolFeePercentagesProvider(_vault, uint256(50e16), uint256(50e16));

        IERC20[] memory tokens = new IERC20[](2);

        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }

        address[] memory assetManagers = new address[](2);

        poolId =
            PoolRegistrationLib.registerComposablePool(_vault, IVault.PoolSpecialization.GENERAL, tokens, assetManagers);

        poolMetadataRegistry = new PoolMetadataRegistry(_vault);

        IRateProvider[] memory rates = new IRateProvider[](2);
        rates[0] = IRateProvider(uint256(1e16));
        rates[1] = IRateProvider(uint256(1e16));

        //   {
        //     name: '',
        //     symbol: '',
        //     tokens: allTokens.subset(2).addresses,
        //     normalizedWeights: [fp(0.5), fp(0.5)],
        //     rateProviders: new Array(2).fill(ZERO_ADDRESS),
        //     assetManagers: new Array(2).fill(ZERO_ADDRESS),
        //     swapFeePercentage: POOL_SWAP_FEE_PERCENTAGE,
        //   },

        //   vault.address,
        //   vault.getFeesProvider().address,
        //   0,
        //   0,
        //   ZERO_ADDRESS,
        // ],

        uint256[] memory normalizedWeights = new uint256[](tokens.length);

        for (uint256 i = 0; i < normalizedWeights.length; i++) {
            normalizedWeights[i] = uint256(5e17);
        }

        _weightedPool = new MockWeightedPool(
                            WeightedPool.NewPoolParams({
                                name: 'TestingPool',
                                symbol: 'TeP',
                                tokens: tokens,
                                normalizedWeights: normalizedWeights,
                                rateProviders: rates,
                                assetManagers: assetManagers,
                                swapFeePercentage: uint256(1e16)
                            }),
                            _vault,
                            _protocolFeeProvider,
                            0,
                            0,
                            address(0)
        );

        // WeightedPoolFactory poolFactory = new WeightedPoolFactory(
        //     _vault,
        //     protocolFeePercentagesProvider,
        //     0,
        //     0
        // );

        // address pool = poolFactory.create(
        //     'TestingPool',
        //     'TeP',
        //     tokens,
        //     normalizedWeights,
        //     rates,
        //     uint256(1e16),
        //     fakeOwner
        // );
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
        emit log_named_address("Pool Address... ", poolAddress);

        // address owner = IPool(poolAddress).getOwner();

        // emit log_named_address('Address pool', owner );
    }
}
