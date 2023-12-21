import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
  useNetwork,
  useChainId,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CheckGaugeMint
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export const checkGaugeMintABI = [
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'BAL',
    outputs: [{ name: '', internalType: 'contract IERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'gaugeCheckpointer',
    outputs: [
      {
        name: '',
        internalType: 'contract IStakelessGaugeCheckpointer',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'gauge',
        internalType: 'contract IStakelessGauge',
        type: 'address',
      },
      { name: 'gaugeType', internalType: 'string', type: 'string' },
    ],
    name: 'queryBalToMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export const checkGaugeMintAddress = {
  1: '0x6a24a03a2209A1513FE99FcE2E06Aac8c8E84880',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export const checkGaugeMintConfig = {
  address: checkGaugeMintAddress,
  abi: checkGaugeMintABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPoolMetadataRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iPoolMetadataRegistryABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'metadataCID',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PoolMetadataUpdated',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PoolMetadataRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export const poolMetadataRegistryABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'vault', internalType: 'contract IVault', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'metadataCID',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'PoolMetadataUpdated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'poolIdMetadataCIDMap',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolIds', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'metadataCIDs', internalType: 'string[]', type: 'string[]' },
    ],
    name: 'setBatchPoolMetadata',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'metadataCID', internalType: 'string', type: 'string' },
    ],
    name: 'setPoolMetadata',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export const poolMetadataRegistryAddress = {
  1: '0xfffa983f4037Faa2e93613d44749280B7F54f62D',
  5: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
  10: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
  100: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
  137: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
  1101: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
  42161: '0xB1631f708a7A9cD30Ae55ea8F085af7CC275D2a2',
  11155111: '0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export const poolMetadataRegistryConfig = {
  address: poolMetadataRegistryAddress,
  abi: poolMetadataRegistryABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const vaultABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: 'authorizer',
        internalType: 'contract IAuthorizer',
        type: 'address',
      },
      { name: 'weth', internalType: 'contract IWETH', type: 'address' },
      { name: 'pauseWindowDuration', internalType: 'uint256', type: 'uint256' },
      {
        name: 'bufferPeriodDuration',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAuthorizer',
        internalType: 'contract IAuthorizer',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AuthorizerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExternalBalanceTransfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'contract IFlashLoanRecipient',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'feeAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FlashLoan',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      { name: 'delta', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'InternalBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'paused', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PausedStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'liquidityProvider',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokens',
        internalType: 'contract IERC20[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'deltas',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
      {
        name: 'protocolFeeAmounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'PoolBalanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'assetManager',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      {
        name: 'cashDelta',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
      {
        name: 'managedDelta',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'PoolBalanceManaged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'poolAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'specialization',
        internalType: 'enum IVault.PoolSpecialization',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'PoolRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'relayer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'RelayerApprovalChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'tokenIn',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenOut',
        internalType: 'contract IERC20',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amountOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Swap',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'tokens',
        internalType: 'contract IERC20[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'TokensDeregistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'tokens',
        internalType: 'contract IERC20[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'assetManagers',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'TokensRegistered',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'WETH',
    outputs: [{ name: '', internalType: 'contract IWETH', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
      {
        name: 'swaps',
        internalType: 'struct IVault.BatchSwapStep[]',
        type: 'tuple[]',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'assetInIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'assetOutIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          {
            name: 'recipient',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'limits', internalType: 'int256[]', type: 'int256[]' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'batchSwap',
    outputs: [
      { name: 'assetDeltas', internalType: 'int256[]', type: 'int256[]' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'deregisterTokens',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      {
        name: 'request',
        internalType: 'struct IVault.ExitPoolRequest',
        type: 'tuple',
        components: [
          {
            name: 'assets',
            internalType: 'contract IAsset[]',
            type: 'address[]',
          },
          {
            name: 'minAmountsOut',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'exitPool',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'recipient',
        internalType: 'contract IFlashLoanRecipient',
        type: 'address',
      },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'userData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'flashLoan',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'selector', internalType: 'bytes4', type: 'bytes4' }],
    name: 'getActionId',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAuthorizer',
    outputs: [
      { name: '', internalType: 'contract IAuthorizer', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
    ],
    name: 'getInternalBalance',
    outputs: [
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'getNextNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getPausedState',
    outputs: [
      { name: 'paused', internalType: 'bool', type: 'bool' },
      { name: 'pauseWindowEndTime', internalType: 'uint256', type: 'uint256' },
      { name: 'bufferPeriodEndTime', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'poolId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPool',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      {
        name: '',
        internalType: 'enum IVault.PoolSpecialization',
        type: 'uint8',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
    ],
    name: 'getPoolTokenInfo',
    outputs: [
      { name: 'cash', internalType: 'uint256', type: 'uint256' },
      { name: 'managed', internalType: 'uint256', type: 'uint256' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'assetManager', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'poolId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getPoolTokens',
    outputs: [
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'balances', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'lastChangeBlock', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getProtocolFeesCollector',
    outputs: [
      {
        name: '',
        internalType: 'contract ProtocolFeesCollector',
        type: 'address',
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'relayer', internalType: 'address', type: 'address' },
    ],
    name: 'hasApprovedRelayer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      {
        name: 'request',
        internalType: 'struct IVault.JoinPoolRequest',
        type: 'tuple',
        components: [
          {
            name: 'assets',
            internalType: 'contract IAsset[]',
            type: 'address[]',
          },
          {
            name: 'maxAmountsIn',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'joinPool',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct IVault.PoolBalanceOp[]',
        type: 'tuple[]',
        components: [
          {
            name: 'kind',
            internalType: 'enum IVault.PoolBalanceOpKind',
            type: 'uint8',
          },
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'token', internalType: 'contract IERC20', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'managePoolBalance',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'ops',
        internalType: 'struct IVault.UserBalanceOp[]',
        type: 'tuple[]',
        components: [
          {
            name: 'kind',
            internalType: 'enum IVault.UserBalanceOpKind',
            type: 'uint8',
          },
          { name: 'asset', internalType: 'contract IAsset', type: 'address' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'sender', internalType: 'address', type: 'address' },
          {
            name: 'recipient',
            internalType: 'address payable',
            type: 'address',
          },
        ],
      },
    ],
    name: 'manageUserBalance',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
      {
        name: 'swaps',
        internalType: 'struct IVault.BatchSwapStep[]',
        type: 'tuple[]',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'assetInIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'assetOutIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'assets', internalType: 'contract IAsset[]', type: 'address[]' },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          {
            name: 'recipient',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'queryBatchSwap',
    outputs: [{ name: '', internalType: 'int256[]', type: 'int256[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'specialization',
        internalType: 'enum IVault.PoolSpecialization',
        type: 'uint8',
      },
    ],
    name: 'registerPool',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokens', internalType: 'contract IERC20[]', type: 'address[]' },
      { name: 'assetManagers', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'registerTokens',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newAuthorizer',
        internalType: 'contract IAuthorizer',
        type: 'address',
      },
    ],
    name: 'setAuthorizer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'paused', internalType: 'bool', type: 'bool' }],
    name: 'setPaused',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'relayer', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setRelayerApproval',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'singleSwap',
        internalType: 'struct IVault.SingleSwap',
        type: 'tuple',
        components: [
          { name: 'poolId', internalType: 'bytes32', type: 'bytes32' },
          { name: 'kind', internalType: 'enum IVault.SwapKind', type: 'uint8' },
          { name: 'assetIn', internalType: 'contract IAsset', type: 'address' },
          {
            name: 'assetOut',
            internalType: 'contract IAsset',
            type: 'address',
          },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'userData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'funds',
        internalType: 'struct IVault.FundManagement',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'fromInternalBalance', internalType: 'bool', type: 'bool' },
          {
            name: 'recipient',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'toInternalBalance', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swap',
    outputs: [
      { name: 'amountCalculated', internalType: 'uint256', type: 'uint256' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const vaultAddress = {
  1: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  5: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  10: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  100: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  137: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  1101: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  42161: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
  11155111: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export const vaultConfig = { address: vaultAddress, abi: vaultABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link checkGaugeMintABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function useCheckGaugeMintRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof checkGaugeMintABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof checkGaugeMintABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof checkGaugeMintAddress } = {} as any,
) {
  return useContractRead({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    ...config,
  } as UseContractReadConfig<
    typeof checkGaugeMintABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link checkGaugeMintABI}__ and `functionName` set to `"BAL"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function useCheckGaugeMintBal<
  TFunctionName extends 'BAL',
  TSelectData = ReadContractResult<typeof checkGaugeMintABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof checkGaugeMintABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof checkGaugeMintAddress } = {} as any,
) {
  return useContractRead({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    functionName: 'BAL',
    ...config,
  } as UseContractReadConfig<
    typeof checkGaugeMintABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link checkGaugeMintABI}__ and `functionName` set to `"gaugeCheckpointer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function useCheckGaugeMintGaugeCheckpointer<
  TFunctionName extends 'gaugeCheckpointer',
  TSelectData = ReadContractResult<typeof checkGaugeMintABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof checkGaugeMintABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof checkGaugeMintAddress } = {} as any,
) {
  return useContractRead({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    functionName: 'gaugeCheckpointer',
    ...config,
  } as UseContractReadConfig<
    typeof checkGaugeMintABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link checkGaugeMintABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function useCheckGaugeMintWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof checkGaugeMintAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof checkGaugeMintABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof checkGaugeMintABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<typeof checkGaugeMintABI, TFunctionName, TMode>({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link checkGaugeMintABI}__ and `functionName` set to `"queryBalToMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function useCheckGaugeMintQueryBalToMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof checkGaugeMintAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof checkGaugeMintABI,
          'queryBalToMint'
        >['request']['abi'],
        'queryBalToMint',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'queryBalToMint'
      }
    : UseContractWriteConfig<
        typeof checkGaugeMintABI,
        'queryBalToMint',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'queryBalToMint'
      } = {} as any,
) {
  return useContractWrite<typeof checkGaugeMintABI, 'queryBalToMint', TMode>({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    functionName: 'queryBalToMint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link checkGaugeMintABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function usePrepareCheckGaugeMintWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof checkGaugeMintABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof checkGaugeMintAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof checkGaugeMintABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link checkGaugeMintABI}__ and `functionName` set to `"queryBalToMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x6a24a03a2209a1513fe99fce2e06aac8c8e84880)
 */
export function usePrepareCheckGaugeMintQueryBalToMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof checkGaugeMintABI, 'queryBalToMint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof checkGaugeMintAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: checkGaugeMintABI,
    address: checkGaugeMintAddress[1],
    functionName: 'queryBalToMint',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof checkGaugeMintABI,
    'queryBalToMint'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iPoolMetadataRegistryABI}__.
 */
export function useIPoolMetadataRegistryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof iPoolMetadataRegistryABI, TEventName>,
    'abi'
  > = {} as any,
) {
  return useContractEvent({
    abi: iPoolMetadataRegistryABI,
    ...config,
  } as UseContractEventConfig<typeof iPoolMetadataRegistryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link iPoolMetadataRegistryABI}__ and `eventName` set to `"PoolMetadataUpdated"`.
 */
export function useIPoolMetadataRegistryPoolMetadataUpdatedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof iPoolMetadataRegistryABI,
      'PoolMetadataUpdated'
    >,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: iPoolMetadataRegistryABI,
    eventName: 'PoolMetadataUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof iPoolMetadataRegistryABI,
    'PoolMetadataUpdated'
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poolMetadataRegistryABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistryRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<
    typeof poolMetadataRegistryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof poolMetadataRegistryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    ...config,
  } as UseContractReadConfig<
    typeof poolMetadataRegistryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `functionName` set to `"poolIdMetadataCIDMap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistryPoolIdMetadataCidMap<
  TFunctionName extends 'poolIdMetadataCIDMap',
  TSelectData = ReadContractResult<
    typeof poolMetadataRegistryABI,
    TFunctionName
  >,
>(
  config: Omit<
    UseContractReadConfig<
      typeof poolMetadataRegistryABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    functionName: 'poolIdMetadataCIDMap',
    ...config,
  } as UseContractReadConfig<
    typeof poolMetadataRegistryABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistryWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof poolMetadataRegistryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof poolMetadataRegistryABI,
          string
        >['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<
        typeof poolMetadataRegistryABI,
        TFunctionName,
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof poolMetadataRegistryABI, TFunctionName, TMode>(
    {
      abi: poolMetadataRegistryABI,
      address:
        poolMetadataRegistryAddress[
          chainId as keyof typeof poolMetadataRegistryAddress
        ],
      ...config,
    } as any,
  )
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `functionName` set to `"setBatchPoolMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistrySetBatchPoolMetadata<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof poolMetadataRegistryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof poolMetadataRegistryABI,
          'setBatchPoolMetadata'
        >['request']['abi'],
        'setBatchPoolMetadata',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setBatchPoolMetadata'
      }
    : UseContractWriteConfig<
        typeof poolMetadataRegistryABI,
        'setBatchPoolMetadata',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setBatchPoolMetadata'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof poolMetadataRegistryABI,
    'setBatchPoolMetadata',
    TMode
  >({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    functionName: 'setBatchPoolMetadata',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `functionName` set to `"setPoolMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistrySetPoolMetadata<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof poolMetadataRegistryAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof poolMetadataRegistryABI,
          'setPoolMetadata'
        >['request']['abi'],
        'setPoolMetadata',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setPoolMetadata'
      }
    : UseContractWriteConfig<
        typeof poolMetadataRegistryABI,
        'setPoolMetadata',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPoolMetadata'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof poolMetadataRegistryABI,
    'setPoolMetadata',
    TMode
  >({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    functionName: 'setPoolMetadata',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePreparePoolMetadataRegistryWrite<
  TFunctionName extends string,
>(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof poolMetadataRegistryABI,
      TFunctionName
    >,
    'abi' | 'address'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof poolMetadataRegistryABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `functionName` set to `"setBatchPoolMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePreparePoolMetadataRegistrySetBatchPoolMetadata(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof poolMetadataRegistryABI,
      'setBatchPoolMetadata'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    functionName: 'setBatchPoolMetadata',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof poolMetadataRegistryABI,
    'setBatchPoolMetadata'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `functionName` set to `"setPoolMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePreparePoolMetadataRegistrySetPoolMetadata(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof poolMetadataRegistryABI,
      'setPoolMetadata'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    functionName: 'setPoolMetadata',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof poolMetadataRegistryABI,
    'setPoolMetadata'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poolMetadataRegistryABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistryEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof poolMetadataRegistryABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    ...config,
  } as UseContractEventConfig<typeof poolMetadataRegistryABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link poolMetadataRegistryABI}__ and `eventName` set to `"PoolMetadataUpdated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xfffa983f4037Faa2e93613d44749280B7F54f62D)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b)
 */
export function usePoolMetadataRegistryPoolMetadataUpdatedEvent(
  config: Omit<
    UseContractEventConfig<
      typeof poolMetadataRegistryABI,
      'PoolMetadataUpdated'
    >,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof poolMetadataRegistryAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: poolMetadataRegistryABI,
    address:
      poolMetadataRegistryAddress[
        chainId as keyof typeof poolMetadataRegistryAddress
      ],
    eventName: 'PoolMetadataUpdated',
    ...config,
  } as UseContractEventConfig<
    typeof poolMetadataRegistryABI,
    'PoolMetadataUpdated'
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"WETH"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultWeth<
  TFunctionName extends 'WETH',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'WETH',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getActionId"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetActionId<
  TFunctionName extends 'getActionId',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getActionId',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getAuthorizer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetAuthorizer<
  TFunctionName extends 'getAuthorizer',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getAuthorizer',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getDomainSeparator"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetDomainSeparator<
  TFunctionName extends 'getDomainSeparator',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getDomainSeparator',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getInternalBalance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetInternalBalance<
  TFunctionName extends 'getInternalBalance',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getInternalBalance',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getNextNonce"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetNextNonce<
  TFunctionName extends 'getNextNonce',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getNextNonce',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPausedState"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetPausedState<
  TFunctionName extends 'getPausedState',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getPausedState',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetPool<
  TFunctionName extends 'getPool',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getPool',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPoolTokenInfo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetPoolTokenInfo<
  TFunctionName extends 'getPoolTokenInfo',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getPoolTokenInfo',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getPoolTokens"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetPoolTokens<
  TFunctionName extends 'getPoolTokens',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getPoolTokens',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getProtocolFeesCollector"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultGetProtocolFeesCollector<
  TFunctionName extends 'getProtocolFeesCollector',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'getProtocolFeesCollector',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"hasApprovedRelayer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultHasApprovedRelayer<
  TFunctionName extends 'hasApprovedRelayer',
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'hasApprovedRelayer',
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof vaultABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, TFunctionName, TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"batchSwap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultBatchSwap<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'batchSwap'
        >['request']['abi'],
        'batchSwap',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'batchSwap' }
    : UseContractWriteConfig<typeof vaultABI, 'batchSwap', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'batchSwap'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'batchSwap', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'batchSwap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deregisterTokens"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultDeregisterTokens<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'deregisterTokens'
        >['request']['abi'],
        'deregisterTokens',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'deregisterTokens'
      }
    : UseContractWriteConfig<typeof vaultABI, 'deregisterTokens', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'deregisterTokens'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'deregisterTokens', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'deregisterTokens',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"exitPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultExitPool<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'exitPool'
        >['request']['abi'],
        'exitPool',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'exitPool' }
    : UseContractWriteConfig<typeof vaultABI, 'exitPool', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'exitPool'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'exitPool', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'exitPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"flashLoan"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultFlashLoan<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'flashLoan'
        >['request']['abi'],
        'flashLoan',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'flashLoan' }
    : UseContractWriteConfig<typeof vaultABI, 'flashLoan', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'flashLoan'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'flashLoan', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'flashLoan',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"joinPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultJoinPool<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'joinPool'
        >['request']['abi'],
        'joinPool',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'joinPool' }
    : UseContractWriteConfig<typeof vaultABI, 'joinPool', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'joinPool'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'joinPool', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'joinPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"managePoolBalance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultManagePoolBalance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'managePoolBalance'
        >['request']['abi'],
        'managePoolBalance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'managePoolBalance'
      }
    : UseContractWriteConfig<typeof vaultABI, 'managePoolBalance', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'managePoolBalance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'managePoolBalance', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'managePoolBalance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"manageUserBalance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultManageUserBalance<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'manageUserBalance'
        >['request']['abi'],
        'manageUserBalance',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'manageUserBalance'
      }
    : UseContractWriteConfig<typeof vaultABI, 'manageUserBalance', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'manageUserBalance'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'manageUserBalance', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'manageUserBalance',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"queryBatchSwap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultQueryBatchSwap<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'queryBatchSwap'
        >['request']['abi'],
        'queryBatchSwap',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'queryBatchSwap'
      }
    : UseContractWriteConfig<typeof vaultABI, 'queryBatchSwap', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'queryBatchSwap'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'queryBatchSwap', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'queryBatchSwap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultRegisterPool<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'registerPool'
        >['request']['abi'],
        'registerPool',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'registerPool'
      }
    : UseContractWriteConfig<typeof vaultABI, 'registerPool', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'registerPool'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'registerPool', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'registerPool',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerTokens"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultRegisterTokens<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'registerTokens'
        >['request']['abi'],
        'registerTokens',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'registerTokens'
      }
    : UseContractWriteConfig<typeof vaultABI, 'registerTokens', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'registerTokens'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'registerTokens', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'registerTokens',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setAuthorizer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultSetAuthorizer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'setAuthorizer'
        >['request']['abi'],
        'setAuthorizer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setAuthorizer'
      }
    : UseContractWriteConfig<typeof vaultABI, 'setAuthorizer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setAuthorizer'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'setAuthorizer', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setAuthorizer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setPaused"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultSetPaused<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'setPaused'
        >['request']['abi'],
        'setPaused',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setPaused' }
    : UseContractWriteConfig<typeof vaultABI, 'setPaused', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPaused'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'setPaused', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setPaused',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setRelayerApproval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultSetRelayerApproval<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          'setRelayerApproval'
        >['request']['abi'],
        'setRelayerApproval',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setRelayerApproval'
      }
    : UseContractWriteConfig<typeof vaultABI, 'setRelayerApproval', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setRelayerApproval'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'setRelayerApproval', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setRelayerApproval',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"swap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultSwap<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof vaultAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, 'swap'>['request']['abi'],
        'swap',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'swap' }
    : UseContractWriteConfig<typeof vaultABI, 'swap', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'swap'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof vaultABI, 'swap', TMode>({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'swap',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"batchSwap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultBatchSwap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'batchSwap'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'batchSwap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'batchSwap'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deregisterTokens"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultDeregisterTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'deregisterTokens'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'deregisterTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'deregisterTokens'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"exitPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultExitPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'exitPool'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'exitPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'exitPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"flashLoan"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultFlashLoan(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'flashLoan'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'flashLoan',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'flashLoan'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"joinPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultJoinPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'joinPool'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'joinPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'joinPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"managePoolBalance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultManagePoolBalance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'managePoolBalance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'managePoolBalance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'managePoolBalance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"manageUserBalance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultManageUserBalance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'manageUserBalance'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'manageUserBalance',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'manageUserBalance'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"queryBatchSwap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultQueryBatchSwap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'queryBatchSwap'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'queryBatchSwap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'queryBatchSwap'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerPool"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultRegisterPool(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'registerPool'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'registerPool',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'registerPool'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"registerTokens"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultRegisterTokens(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'registerTokens'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'registerTokens',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'registerTokens'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setAuthorizer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultSetAuthorizer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setAuthorizer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setAuthorizer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setAuthorizer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setPaused"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultSetPaused(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setPaused'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setPaused',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setPaused'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setRelayerApproval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultSetRelayerApproval(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'setRelayerApproval'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'setRelayerApproval',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'setRelayerApproval'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"swap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function usePrepareVaultSwap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, 'swap'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    functionName: 'swap',
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, 'swap'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    ...config,
  } as UseContractEventConfig<typeof vaultABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"AuthorizerChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultAuthorizerChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'AuthorizerChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'AuthorizerChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'AuthorizerChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"ExternalBalanceTransfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultExternalBalanceTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'ExternalBalanceTransfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'ExternalBalanceTransfer',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'ExternalBalanceTransfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"FlashLoan"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultFlashLoanEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'FlashLoan'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'FlashLoan',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'FlashLoan'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"InternalBalanceChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultInternalBalanceChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'InternalBalanceChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'InternalBalanceChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'InternalBalanceChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PausedStateChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultPausedStateChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PausedStateChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'PausedStateChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PausedStateChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolBalanceChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultPoolBalanceChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolBalanceChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'PoolBalanceChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolBalanceChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolBalanceManaged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultPoolBalanceManagedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolBalanceManaged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'PoolBalanceManaged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolBalanceManaged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"PoolRegistered"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultPoolRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'PoolRegistered'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'PoolRegistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'PoolRegistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"RelayerApprovalChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultRelayerApprovalChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'RelayerApprovalChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'RelayerApprovalChanged',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'RelayerApprovalChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Swap"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultSwapEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'Swap'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'Swap',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'Swap'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"TokensDeregistered"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultTokensDeregisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'TokensDeregistered'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'TokensDeregistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'TokensDeregistered'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"TokensRegistered"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://explorer.optimism.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Gnosis Gnosis Chain Explorer__](https://blockscout.com/xdai/mainnet/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Polygon Scan__](https://polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Polygon Zk Evm Polygon Scan__](https://zkevm.polygonscan.com/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Arbitrum One Arbiscan__](https://arbiscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xBA12222222228d8Ba445958a75a0704d566BF2C8)
 */
export function useVaultTokensRegisteredEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, 'TokensRegistered'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof vaultAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: vaultABI,
    address: vaultAddress[chainId as keyof typeof vaultAddress],
    eventName: 'TokensRegistered',
    ...config,
  } as UseContractEventConfig<typeof vaultABI, 'TokensRegistered'>)
}
