// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

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

    /// @notice Wraps a single pool ID in an array.
    /// @param poolId The pool ID to wrap.
    function _wrapPoolId(bytes32 poolId) internal pure returns (bytes32[] memory) {
        bytes32[] memory wrappedPoolId = new bytes32[](1);
        wrappedPoolId[0] = poolId;
        return wrappedPoolId;
    }

    /// @notice Reverts unless the pools with the given ID are registered on Balancer.
    /// @param poolIds The IDs of the pool to check registration status for.
    modifier onlyRegisteredPools(bytes32[] memory poolIds) {
        for (uint256 i = 0; i < poolIds.length; i++) {
            require(_isPoolRegistered(poolIds[i]), "Pool not registered");
        }
        _;
    }

    /// @notice Reverts unless the caller is allowed to call update for every pool.
    /// @param poolIds The IDs of the pools that the caller wants to access.
    modifier authenticatePools(bytes32[] memory poolIds) {
        bytes32 actionId = getActionId(msg.sig);
        for (uint256 i = 0; i < poolIds.length; i++) {
            bytes32 poolId = poolIds[i];
            require(_canPerform(actionId, poolId, msg.sender), "sender not allowed");
        }
        _;
    }

    /**
     * @notice Validate the size of two arrays to avoid exceeding the gas limit and ensure equal length.
     * @dev Set maxArraySize to 2**11 to not allow more transactions that would revert
     * due to gas limit. As of 30.Mar.2022, gas limits were the following:
     * Ethereum (~30M), Polygon (<30M), Gnosis (~30M), Arbitrum (~30M)
     * For more info see /chart/gaslimit in chain blockchain explorer
     * e.g. https://polygonscan.com/chart/gaslimit
     * @param poolIds Array of pool IDs to be validated
     * @param metadataCIDs Array of metadata CIDs to be validated
     */
    modifier validateArraySize(bytes32[] memory poolIds, string[] memory metadataCIDs) {
        uint256 maxArraySize = 2 ** 11;
        require(poolIds.length <= maxArraySize && metadataCIDs.length <= maxArraySize, "Array size exceeds the limit");
        require(poolIds.length == metadataCIDs.length, "Array size mismatch");
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
    function _setPoolMetadata(bytes32 poolId, string memory metadataCID) internal {
        require(bytes(metadataCID).length > 0, "CID cannot be empty");
        require(bytes(metadataCID).length <= 46, "CID too long");

        poolIdMetadataCIDMap[poolId] = metadataCID;
        emit PoolMetadataUpdated(poolId, metadataCID);
    }

    /// @notice Ensures that the pool exists and the caller is allowed to change its metadata
    /// @param poolId The pool ID to update the metadata
    /// @param metadataCID The metadataCID related to the new pool metadata
    function setPoolMetadata(bytes32 poolId, string memory metadataCID)
        public
        onlyRegisteredPools(_wrapPoolId(poolId))
        authenticatePools(_wrapPoolId(poolId))
    {
        _setPoolMetadata(poolId, metadataCID);
    }

    function setBatchPoolMetadata(bytes32[] calldata poolIds, string[] calldata metadataCIDs)
        public
        validateArraySize(poolIds, metadataCIDs)
        onlyRegisteredPools(poolIds)
        authenticatePools(poolIds)
    {
        for (uint256 i = 0; i < poolIds.length; i++) {
            _setPoolMetadata(poolIds[i], metadataCIDs[i]);
        }
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
