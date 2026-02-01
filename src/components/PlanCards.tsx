'use client';

import type { Plan } from '@/types/project';
import { PlanCard } from './PlanCard';

export function PlanCards({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return null;

  return (
    <section 
      className="flex flex-wrap gap-6 justify-start items-end"
    >
      {plans.map((plan, index) => (
        <PlanCard key={`${plan.src}-${plan.page ?? index}`} plan={plan} />
      ))}
    </section>
  );
}
