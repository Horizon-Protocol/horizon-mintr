/*
 *
 * READ
 * 合约来自仓库
 * https://github.com/Horizon-Protocol/horizon-utility/blob/master/contracts/SynthSummaryUtil.sol
 * 需要在更新部署后手动修改为最新的合约地址
 *
 */
const synthSummary = {
  addresses: {
    56: '0xf87A0587Fe48Ca05dd68a514Ce387C0d4d3AE31C',
    97: '0x19165a78Abd8ec4a2eAC02d98d527b698Bb9c526',
  },
  abi: [
    {
      inputs: [{ internalType: 'address', name: 'resolver', type: 'address' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      constant: true,
      inputs: [],
      name: 'addressResolverProxy',
      outputs: [{ internalType: 'contract IAddressResolver', name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'frozenSynths',
      outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'synthsBalances',
      outputs: [
        { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
        { internalType: 'uint256[]', name: '', type: 'uint256[]' },
        { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'synthsRates',
      outputs: [
        { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
        { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'synthsTotalSupplies',
      outputs: [
        { internalType: 'bytes32[]', name: '', type: 'bytes32[]' },
        { internalType: 'uint256[]', name: '', type: 'uint256[]' },
        { internalType: 'uint256[]', name: '', type: 'uint256[]' },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      ],
      name: 'totalSynthsInKey',
      outputs: [{ internalType: 'uint256', name: 'total', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

export default synthSummary;
