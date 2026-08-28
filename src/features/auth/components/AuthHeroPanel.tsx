import { Lock, RotateCcw, Shield, User } from "lucide-react";
import spotqLogo from "@/assets/logos/spotq-logo.png";

interface AuthHeroPanelProps {
  title?: string;
  description?: string;
  iconType?: "user" | "shield-lock" | "reset-lock";
  graphicPosition?: "top" | "bottom";
}

export const AuthHeroPanel = ({
  title = "Welcome back, foodie.",
  description = "The table is set, and your spot is waiting. Sign in to skip the queue and dive straight into your next culinary adventure.",
  iconType = "user",
  graphicPosition = "bottom",
}: AuthHeroPanelProps) => {
  const renderIconGraphic = () => {
    if (iconType === "reset-lock") {
      return (
        <div className="size-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl relative group/card transition-all duration-300 hover:scale-105">
          <div className="relative flex items-center justify-center">
            <RotateCcw className="size-12 text-white stroke-[2.5]" />
            <Lock className="size-4 text-white absolute" />
          </div>
        </div>
      );
    }

    if (iconType === "shield-lock") {
      return (
        <div className="w-full aspect-[4/3] rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative group/card transition-all duration-300 hover:scale-[1.02]">
          <div className="relative flex items-center justify-center size-24 rounded-2xl bg-white/15 border border-white/25 shadow-inner">
            <Shield className="size-14 text-white fill-white/20 stroke-[1.5]" />
            <Lock className="size-6 text-white absolute mt-1" />
          </div>
        </div>
      );
    }

    // Default "user"
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative group/card transition-all duration-300 hover:scale-[1.02]">
        <div className="size-24 rounded-full bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
          <User className="size-12 text-white" />
        </div>
      </div>
    );
  };

  return (
    <div className="hidden md:flex md:w-1/2 bg-spotq-orange text-white p-12 flex-col justify-between relative overflow-hidden select-none">
      {/* Brand Logo & Name Header */}
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-xl p-2 shadow-md">
          <img src={spotqLogo} alt="SpotQ Logo" className="h-6 w-auto" />
        </div>
        <span className="font-bold text-xl tracking-wide">SpotQ</span>
      </div>

      {/* Center content and graphics */}
      <div className="space-y-8 max-w-md my-auto">
        {graphicPosition === "top" && (
          <div className="flex justify-start">{renderIconGraphic()}</div>
        )}

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl">
            {title}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">{description}</p>
        </div>

        {graphicPosition === "bottom" && renderIconGraphic()}
      </div>

      {/* Footer info */}
      <div className="text-xs text-white/60">
        © {new Date().getFullYear()} SpotQ Platform. All rights reserved.
      </div>
    </div>
  );
};
