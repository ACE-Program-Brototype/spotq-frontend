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
    <aside className="group relative flex w-full max-w-[380px] items-center rounded-2xl border border-neutral-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-[1.01] hover:border-[#ff6b00]/40 hover:shadow-2xl">
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-1 items-center gap-3.5 text-left min-w-0 pr-6 cursor-pointer bg-transparent border-0 p-0"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#ff6b00] ring-1 ring-orange-200/70 shadow-2xs">
          <Bell className="size-5 transition-transform duration-300 group-hover:rotate-12" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{title}</h4>
          {body && (
            <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">{body}</p>
          )}
        </div>

        {deepLink && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ff6b00] text-white shadow-xs transition-all duration-200 group-hover:scale-110 group-hover:bg-[#e05e00] group-hover:translate-x-0.5">
            <ArrowRight className="size-4" />
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 rounded-full p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Close"
      >
        <X className="size-3.5" />
      </button>
    </aside>
  );
}
