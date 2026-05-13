import { useStore } from '@nanostores/react';
import { useEffect, useMemo, useState } from 'react';
import { xpAtom, unlockedRewardsAtom, unlockReward, type RewardType } from '../lib/store';
import { gsap } from 'gsap';

export interface Reward {
  xp: number;
  type: string;
  title: string;
  desc: string;
  icon: string;
}

interface Props {
  rewards: Reward[];
}

export default function RewardToast({ rewards }: Props) {
  const xp = useStore(xpAtom);
  const unlocked = useStore(unlockedRewardsAtom);
  const [activeReward, setActiveReward] = useState<Reward | null>(null);

  const sortedDesc = useMemo(
    () => [...rewards].sort((a, b) => b.xp - a.xp),
    [rewards]
  );

  useEffect(() => {
    for (const reward of sortedDesc) {
      if (xp >= reward.xp && !unlocked.has(reward.type as RewardType)) {
        unlockReward(reward.type as RewardType);
        setActiveReward(reward);
        
        // Calmer entrance — no bouncy overshoot. Settles in instead of springing.
        gsap.fromTo("#reward-toast",
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power2.out" }
        );

        setTimeout(() => {
          gsap.to("#reward-toast", {
            y: 60,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => setActiveReward(null)
          });
        }, 6000);
        
        break;
      }
    }
  }, [xp, unlocked]);

  if (!activeReward) return null;

  return (
    <div
      id="reward-toast"
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-sm z-50 glass-card p-4 pointer-events-auto"
      style={{ borderLeft: '4px solid var(--color-accent-secondary)' }}
    >
      <div className="flex gap-4">
        <div className="text-3xl flex-shrink-0">{activeReward.icon}</div>
        <div>
          <h4 className="font-bold text-sm text-[var(--color-accent-primary)] mb-1">
            {activeReward.title}
          </h4>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {activeReward.desc}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setActiveReward(null)}
        aria-label="Скрыть награду"
        className="absolute top-1 right-1 w-9 h-9 flex items-center justify-center text-[var(--color-text-secondary)]/40 hover:text-[var(--color-text-secondary)] text-lg"
      >
        &times;
      </button>
    </div>
  );
}
