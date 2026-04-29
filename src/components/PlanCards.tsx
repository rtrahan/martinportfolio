'use client';

import type { Plan } from '@/types/project';
import { PlanCard } from './PlanCard';

export function PlanCards({ plans, compact = false }: { plans: Plan[]; compact?: boolean }) {
  if (plans.length === 0) return null;

  return (
    <section
      className={
        compact
          ? 'grid grid-cols-2 gap-3'
          : 'flex flex-wrap gap-5 lg:gap-7 justify-center items-end'
      }
      aria-label="Project plans"
    >
      {plans.map((plan, index) => (
        <PlanCard
          key={`${plan.src}-${plan.page ?? index}`}
          plan={plan}
          compact={compact}
          index={index + 1}
          total={plans.length}
        />
      ))}
    </section>
  );
}
