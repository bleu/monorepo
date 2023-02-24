// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";

/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract (description...)
contract PoolMetadataRegistry {
    address private constant BALANCER_VAULT_ADDR = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;

    IVault private immutable _vault;

    constructor(IVault vault) {
        _vault = vault;
    }

    /// @notice Check if a Pool is registered on Balancer
    /// @param poolId The pool ID to check against the Balancer vault
    /// @return bool Returns TRUE for registered and FALSE for unregistered
    function isPoolRegistered(bytes32 poolId) public view returns (bool) {
        try _vault.getPool(poolId) returns (address, IVault.PoolSpecialization) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }
}
