import { parseAbi } from 'viem';

export const JNS_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_JNS_TOKEN_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000001';
export const JNS_STAKING_ADDRESS = (process.env.NEXT_PUBLIC_JNS_STAKING_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000002';

export const JNS_TOKEN_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)'
]);

export const JNS_STAKING_ABI = parseAbi([
  'function totalJNSLocked() external view returns (uint256)'
]);
