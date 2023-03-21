// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IVault.sol";
import "balancer-v2-monorepo/pkg/solidity-utils/contracts/helpers/Authentication.sol";
import {BasePoolAuthorization} from "balancer-v2-monorepo/pkg/pool-utils/contracts/BasePoolAuthorization.sol";
import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IAuthorizer.sol";

import "./PoolMetadataAuthorization.sol";

interface IPoolMetadataRegistry {
    event PoolMetadataUpdated(bytes32 indexed poolId, string metadataCID);
}

/// TODO: https://linear.app/bleu-llc/issue/BAL-84/define-poolmetadataregistrysol-metadata
/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract provides a registry for Balancer's Pools metadata
contract PoolMetadataRegistry is IPoolMetadataRegistry, PoolMetadataAuthorization {
    IVault private immutable _vault;
    bytes32 private _poolId;
    mapping(bytes32 => string) public poolIdMetadataCIDMap;

    constructor(IVault vault) Authentication(bytes32(uint256(address(this)))) PoolMetadataAuthorization() {
        _vault = vault;
    }

    modifier onlyRegisteredPool(bytes32 poolId) {
        require(_isPoolRegistered(poolId), "Pool not registered");
        _;
    }

    /// @notice setPoolId modifier is used to set the pool ID before the authenticate modifier is called.
    /// The authenticate modifier then calls the canPerform function,
    /// which in turn calls the _getOwner function that requires the pool ID.
    modifier setPoolId(bytes32 poolId) {
        _poolId = poolId;
        _;
    }

    /// @notice Checks if a Pool is registered on Balancer
    /// @param poolId The pool ID to check against the Balancer vault
    /// @return bool Returns TRUE for registered and FALSE for unregistered
    function _isPoolRegistered(bytes32 poolId) internal view returns (bool) {
        try _vault.getPool(poolId) returns (address, IVault.PoolSpecialization) {
            return true;
        } catch (bytes memory) {
            return false;
        }
    }

    /// @notice Returns the authorizer contract for managing access control
    /// @return The authorizer contract
    function _getAuthorizer() internal view override returns (IAuthorizer) {
        return _vault.getAuthorizer();
    }

    /// @notice Returns the owner of the pool that's currently being operated on
    /// @return The owner of the pool
    function _getOwner() internal view override returns (address) {
        (address pool,) = _vault.getPool(_poolId);
        return BasePoolAuthorization(pool).getOwner();
    }

    /// @notice Updates the pool metadata CID
    /// @param poolId The pool ID to update the metadata
    /// @param metadataCID The metadataCID related to the new pool metadata
    function setPoolMetadata(bytes32 poolId, string memory metadataCID)
        public
        onlyRegisteredPool(poolId)
        setPoolId(poolId)
        authenticate
    {
        poolIdMetadataCIDMap[poolId] = metadataCID;
        emit PoolMetadataUpdated(poolId, metadataCID);
    }
}
