// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";

/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract (description...)
contract PoolMetadataRegistry {

    /// @notice Vault address on Goerli Testnet (temporary)
    IVault public immutable vault = IVault(0xBA12222222228d8Ba445958a75a0704d566BF2C8);

    /// @notice Check if a Pool is registered on Balancer
    /// @param poolId The pool ID to check against the Balancer vault
    /// @return bool Returns TRUE for registered and FALSE for unregistered
    function isPoolRegistered(
        bytes32 poolId
    ) public view returns (bool) {
        try vault.getPool(poolId) returns (address, IVault.PoolSpecialization) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }
}
