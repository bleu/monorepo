// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/// @title PoolMetadataAuthentication
/// @dev Contract for authenticating callers before they can perform certain actions on a pool metadata.
abstract contract PoolMetadataAuthentication {
    bytes32 private immutable _actionIdDisambiguator;

    constructor(bytes32 actionIdDisambiguator) {
        _actionIdDisambiguator = actionIdDisambiguator;
    }

    /// @notice Reverts unless the caller is allowed to call this function.
    /// @param poolId The ID of the pool that the caller wants to access.
    modifier authenticate(bytes32 poolId) {
        _authenticateCaller(poolId);
        _;
    }

    /// @notice Reverts unless the caller is allowed to call the entry point function.
    /// @param poolId The ID of the pool that the caller wants to access.
    function _authenticateCaller(bytes32 poolId) internal view {
        bytes32 actionId = getActionId(msg.sig);
        require(_canPerform(actionId, poolId, msg.sender), "sender not allowed");
    }

    /// @notice Computes the action ID for a given function selector.
    /// @param selector The function selector to compute the action ID for.
    /// @return The computed action ID.
    function getActionId(bytes4 selector) public view returns (bytes32) {
        return keccak256(abi.encodePacked(_actionIdDisambiguator, selector));
    }

    /// @notice Determines whether a user is allowed to perform a given action on a pool metadata.
    /// @param actionId The ID of the action being performed.
    /// @param poolId The ID of the pool that the user wants to access.
    /// @param user The address of the user who wants to perform the action.
    /// @return True if the user is allowed to perform the action, false otherwise.
    function _canPerform(bytes32 actionId, bytes32 poolId, address user) internal view virtual returns (bool);
}
