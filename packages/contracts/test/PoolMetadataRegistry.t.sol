// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../src/PoolMetadataRegistry.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IProtocolFeePercentagesProvider.sol";
import "@balancer-labs/v2-vault/contracts/Vault.sol";
import "@balancer-labs/v2-pool-utils/contracts/lib/PoolRegistrationLib.sol";
import 'balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPool.sol';
import 'balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPool.sol';
import 'balancer-v2-monorepo/pkg/pool-weighted/contracts/WeightedPoolFactory.sol';
import 'balancer-v2-monorepo/pkg/standalone-utils/contracts/ProtocolFeePercentagesProvider.sol';

import {Test} from "forge-std/Test.sol";


contract PoolMetadataRegistryTest is Test {
    PoolMetadataRegistry poolMetadataRegistry; 
    IVault private _vault;
    bytes32 poolId;

    address fakeOwner = address(11);

    function setUp() external {
        _vault = new Vault(IAuthorizer(0), IWETH(0), 0, 0);

        IERC20[] memory tokens = new IERC20[](2);
        for (uint256 i = 0; i < tokens.length; i++) {
            tokens[i] = IERC20(i + 1);
        }
        address[] memory assetManagers = new address[](2);

        poolId = PoolRegistrationLib.registerComposablePool(
                                            _vault, 
                                            IVault.PoolSpecialization.GENERAL, 
                                            tokens, 
                                            assetManagers);

        poolMetadataRegistry = new PoolMetadataRegistry(_vault);


        uint256[] memory normalizedWeights = new uint256[](tokens.length);
        for (uint8 i = 0; i < tokens.length; i++) {
            normalizedWeights[i] = 0.5e18; // 50% (sum needs to be 100%)
        }
        
        IRateProvider[] memory rates = new IRateProvider[](2);
        rates[0] = IRateProvider(1e18);
        rates[1] = IRateProvider(1e18);

        // weightedPool = new MockWeightedPool(
        //                     WeightedPool.NewPoolParams({
        //                         name: 'TestingPool',
        //                         symbol: 'TeP',
        //                         tokens: tokens,
        //                         normalizedWeights: normalizedWeights,
        //                         rateProviders: rates,
        //                         assetManagers: new address[](tokens.length), 
        //                         swapFeePercentage: uint256(1e16)
        //                     }),
        //                     _vault,
        //                     new ProtocolFeePercentagesProvider(
        //                         _vault,
        //                         1e18,
        //                         1e18
        //                     ),
        //                     0,
        //                     0,
        //                     fakeOwner
        // );

        ProtocolFeePercentagesProvider protocolFeePercentagesProvider = 
                    new ProtocolFeePercentagesProvider(_vault,2,2);

        WeightedPoolFactory poolFactory = new WeightedPoolFactory(
            _vault,
            protocolFeePercentagesProvider,
            0,
            0
        );

        address pool = poolFactory.create(
            'TestingPool',
            'TeP',
            tokens,
            normalizedWeights,
            rates,
            uint256(1e16),
            fakeOwner
        );

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

        // address owner = IPool(poolAddress).getOwner();

        // emit log_named_address('Address pool', owner );

    }

}
