import { ArrowRight, Bell, X } from "lucide-react";
import type { ReactElement } from "react";
import { toast } from "sonner";

export interface PushNotificationToastProps {
  id: string | number;
  title: string;
  body?: string;
  deepLink?: string;
  onNavigate?: (url: string) => void;
}

export function PushNotificationToast({
  id,
  title,
  body,
  deepLink,
  onNavigate,
}: PushNotificationToastProps): ReactElement {
  const handleClick = () => {
    toast.dismiss(id);
    if (deepLink && onNavigate) {
      onNavigate(deepLink);
    }
  };

  const handleDismiss = () => {
    toast.dismiss(id);
  };

  return (
    <aside className="group relative flex w-[356px] min-w-[356px] max-w-[calc(100vw-32px)] items-center rounded-xl border border-neutral-200/90 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-orange-500/30 hover:shadow-xl">
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-1 items-center gap-3 text-left min-w-0 pr-5 cursor-pointer bg-transparent border-0 p-0"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#ff6b00] ring-1 ring-orange-200/70">
          <Bell className="size-4.5 transition-transform duration-200 group-hover:rotate-12" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-neutral-900 leading-snug truncate">{title}</h4>
          {body && (
            <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1 leading-normal">{body}</p>
          )}
        </div>

        {deepLink && (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-white shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:bg-[#e05e00] group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" />
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 rounded-md p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Close"
      >
        <X className="size-3.5" />
      </button>
    </aside>
  );
}
