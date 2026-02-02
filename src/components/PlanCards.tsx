'use client';

import type { Plan } from '@/types/project';
import { PlanCard } from './PlanCard';

export function PlanCards({ plans, compact = false }: { plans: Plan[]; compact?: boolean }) {
  if (plans.length === 0) return null;

  return (
    <section 
      className={compact 
        ? "grid grid-cols-2 gap-3" 
        : "flex flex-wrap gap-6 justify-start items-end"
      }
    >
      {plans.map((plan, index) => (
        <PlanCard key={`${plan.src}-${plan.page ?? index}`} plan={plan} compact={compact} />
      ))}
    </section>
  );
}
