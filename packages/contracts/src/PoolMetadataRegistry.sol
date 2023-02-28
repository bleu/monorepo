// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IVault.sol";

/// TODO: https://linear.app/bleu-llc/issue/BAL-84/define-poolmetadataregistrysol-metadata
/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract (description...)
contract PoolMetadataRegistry {
    IVault private immutable _vault;

    mapping(bytes32 => bytes32) private _poolsMetadata;

    constructor(IVault vault) {
        _vault = vault;
    }

    event PoolMetadataUpdated(bytes32 poolId, bytes32 ipfsHash);

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

    /// @notice Update a pool metadata
    /// @param poolId The pool ID to update the metadata
    /// @param ipfsHash The ipfsHash related to the new pool metadata
    function updatePoolMetadata(bytes32 poolId, bytes32 ipfsHash) public {
        require(isPoolRegistered(poolId), "Pool not registered");
        // TODO: https://linear.app/bleu-llc/issue/BAL-85/check-if-the-caller-is-the-owner
        // require(isPoolOwner(poolId, address), "Caller is not the owner");
        _poolsMetadata[poolId] = ipfsHash;
        emit PoolMetadataUpdated(poolId, ipfsHash);
    }
}
