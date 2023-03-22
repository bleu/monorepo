// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "balancer-v2-monorepo/pkg/interfaces/contracts/vault/IAuthorizer.sol";
import "balancer-v2-monorepo/pkg/solidity-utils/contracts/helpers/Authentication.sol";
import {BasePoolAuthorization} from "balancer-v2-monorepo/pkg/pool-utils/contracts/BasePoolAuthorization.sol";

abstract contract PoolMetadataAuthorization is Authentication {
    address internal constant _DELEGATE_OWNER = 0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B;

    /// @notice Determines whether an action can be performed by a given account
    /// @param actionId The ID of the action to be performed
    /// @param account The account to check for authorization
    /// @return bool Returns true if the action can be performed, otherwise false
    function _canPerform(bytes32 actionId, address account) internal view override returns (bool) {
        if (_getOwner() != _DELEGATE_OWNER) {
            // Only the owner can perform "owner only" actions, unless the owner is delegated.
            return msg.sender == _getOwner();
        } else {
            // Non-owner actions are always processed via the Authorizer, as "owner only" ones are when delegated.
            return _getAuthorizer().canPerform(actionId, account, address(this));
        }
    }

    /// @notice Returns the owner of the pool that's currently being operated on
    /// @return The owner of the pool
    function _getOwner() internal view virtual returns (address);

    /// @notice Returns the authorizer contract for managing access control
    /// @return The authorizer contract
    function _getAuthorizer() internal view virtual returns (IAuthorizer);
}
