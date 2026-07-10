import { parseAbi } from 'viem';

export const JNS_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_JNS_TOKEN_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000001';
export const JNS_STAKING_ADDRESS = (process.env.NEXT_PUBLIC_JNS_STAKING_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000002';

export const JNS_TOKEN_ABI = parseAbi([
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)'
]);

export const JNS_STAKING_ABI = parseAbi([
  'struct StakeInfo { uint256 amount; uint256 jnsxAmount; uint256 unlockTime; uint256 multiplier; uint256 durationInDays; bool isVip; }',
  'function totalJNSLocked() external view returns (uint256)',
  'function deposit(uint256 amount, uint8 lockType) external',
  'function getUserStakes(address account) external view returns (StakeInfo[])'
]);
