import { Check, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan } from "@/features/subscription/types/subscription.types";

interface PlanCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  isLoading?: boolean;
  onSelect: (planId: string) => void;
}

export function PlanCard({ plan, isPopular, isLoading, onSelect }: PlanCardProps) {
  const isHighlighted = isPopular || plan.code === "QUEUE_PRO";

  return (
    <div
      data-testid={`plan-card-${plan.code.toLowerCase()}`}
      className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
        isHighlighted
          ? "border-2 border-orange-500 bg-white shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/20"
          : "border border-neutral-200 bg-white/80 shadow-md hover:border-neutral-300 hover:shadow-lg"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 px-3.5 py-1 text-xs font-semibold text-white shadow-md">
            <Sparkles className="h-3.5 w-3.5" />
            Most Popular
          </Badge>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-neutral-900">{plan.name}</h3>
        {plan.description && (
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{plan.description}</p>
        )}
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
          ₹{plan.priceInRupees.toLocaleString("en-IN")}
        </span>
        <span className="text-sm font-medium text-neutral-500">
          /{plan.billingCycle.toLowerCase()}
        </span>
      </div>

      <div className="mb-8 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          What's included:
        </p>
        <ul className="mt-4 space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-neutral-700">
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  isHighlighted
                    ? "bg-orange-100 text-orange-600"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span className="leading-5">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        type="button"
        data-testid={`btn-select-plan-${plan.code.toLowerCase()}`}
        disabled={isLoading}
        onClick={() => onSelect(plan.id)}
        className={`w-full py-6 text-base font-semibold transition-all ${
          isHighlighted
            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25 hover:bg-orange-700"
            : "bg-neutral-900 text-white hover:bg-neutral-800"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Order...
          </span>
        ) : (
          `Get Started with ${plan.name}`
        )}
      </Button>
    </div>
  );
}
