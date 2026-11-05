import { getSubscriberStatusStyles } from "../utils/subscriber.utils";

export interface SubscriberStatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function SubscriberStatusBadge({ status, className = "" }: SubscriberStatusBadgeProps) {
  const { badge, dot, label } = getSubscriberStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge} ${className}`}
      data-testid="subscriber-status-badge"
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
