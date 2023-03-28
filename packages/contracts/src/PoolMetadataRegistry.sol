// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IVault.sol";
import {BasePoolAuthorization} from "balancer-v2-monorepo/pkg/pool-utils/contracts/BasePoolAuthorization.sol";
import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IAuthorizer.sol";

interface IPoolMetadataRegistry {
    event PoolMetadataUpdated(bytes32 indexed poolId, string metadataCID);
}

/// TODO: https://linear.app/bleu-llc/issue/BAL-84/define-poolmetadataregistrysol-metadata
/// @title A Pool Metadata dApp
/// @author Bleu LLC
/// @notice This contract provides a registry for Balancer's Pools metadata
contract PoolMetadataRegistry is IPoolMetadataRegistry {
    IVault private immutable _vault;
    address internal constant _DELEGATE_OWNER = 0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B;
    mapping(bytes32 => string) public poolIdMetadataCIDMap;

    constructor(IVault vault) {
        _vault = vault;
    }

    /// @notice Reverts unless the pool with the given ID is registered on Balancer.
    /// @param poolId The ID of the pool to check registration status for.
    modifier onlyRegisteredPool(bytes32 poolId) {
        require(_isPoolRegistered(poolId), "Pool not registered");
        _;
    }

    /// @notice Reverts unless the caller is allowed to call the function.
    /// @param poolId The ID of the pool that the caller wants to access.
    modifier authenticate(bytes32 poolId) {
        bytes32 actionId = getActionId(msg.sig);
        require(_canPerform(actionId, poolId, msg.sender), "sender not allowed");
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

    /// @notice Updates the pool metadata CID
    /// @param poolId The pool ID to update the metadata
    /// @param metadataCID The metadataCID related to the new pool metadata
    function setPoolMetadata(bytes32 poolId, string memory metadataCID)
        public
        onlyRegisteredPool(poolId)
        authenticate(poolId)
    {
        poolIdMetadataCIDMap[poolId] = metadataCID;
        emit PoolMetadataUpdated(poolId, metadataCID);
    }

    /// @notice Computes the action ID for a given function selector.
    /// @param selector The function selector to compute the action ID for.
    /// @return The computed action ID.
    function getActionId(bytes4 selector) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(bytes32(uint256(address(this))), selector));
    }

    /// @notice Determines whether an action can be performed by a given account
    /// @param actionId The ID of the action to be performed
    /// @param account The account to check for authorization
    /// @return bool Returns true if the action can be performed, otherwise false
    function _canPerform(bytes32 actionId, bytes32 poolId, address account) internal view returns (bool) {
        (address pool,) = _vault.getPool(poolId);
        address poolOwner = BasePoolAuthorization(pool).getOwner();

        if (poolOwner != _DELEGATE_OWNER) {
            // Only the owner can perform "owner only" actions, unless the owner is delegated.
            return msg.sender == poolOwner;
        } else {
            // Non-owner actions are always processed via the Authorizer, as "owner only" ones are when delegated.
            return _vault.getAuthorizer().canPerform(actionId, account, pool);
        }
    }
}
