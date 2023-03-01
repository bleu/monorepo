// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IBasePool.sol";

interface Pool {
    function getOwner() external view returns (address);
}

/// TODO: https://linear.app/bleu-llc/issue/BAL-84/define-poolmetadataregistrysol-metadata
/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract (description...)
contract PoolMetadataRegistry {
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

    /// @notice Check if the caller is the pool owner
    /// @param poolId The pool ID where the ownership will be tested.
    /// @return bool Returns TRUE if the caller is the Pool owner, FALSE otherwise.
    function isPoolOwner(bytes32 poolId) public view returns (bool) {

        (address pool, ) = _vault.getPool(poolId);
        
        return Pool(pool).getOwner() == msg.sender ? true : false;
    }
}
