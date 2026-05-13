import { atom } from 'nanostores';

export const xpAtom = atom(0);

export type RewardType = 'quiz' | 'pdf' | 'discount' | 'badge';

export const unlockedRewardsAtom = atom<Set<RewardType>>(new Set());

export function unlockReward(reward: RewardType) {
  const current = unlockedRewardsAtom.get();
  if (!current.has(reward)) {
    const next = new Set(current);
    next.add(reward);
    unlockedRewardsAtom.set(next);
  }
}
