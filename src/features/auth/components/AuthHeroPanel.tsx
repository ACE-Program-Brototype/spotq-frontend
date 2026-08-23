import { User } from "lucide-react";
import spotqLogo from "@/assets/logos/spotq-logo.png";

export const AuthHeroPanel = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-spotq-orange text-white p-12 flex-col justify-between relative overflow-hidden select-none">
      {/* Brand Logo & Name Header */}
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-xl p-2 shadow-md">
          <img src={spotqLogo} alt="SpotQ Logo" className="h-6 w-auto" />
        </div>
        <span className="font-bold text-xl tracking-wide">SpotQ</span>
      </div>

      {/* Center welcome text and high-fidelity graphics */}
      <div className="space-y-8 max-w-md my-auto">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl">
            Welcome back, foodie.
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            The table is set, and your spot is waiting. Sign in to skip the queue and dive straight
            into your next culinary adventure.
          </p>
        </div>

        {/* Floating graphic card element */}
        <div className="w-full aspect-[4/3] rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl relative group/card transition-all duration-300 hover:scale-[1.02]">
          <div className="size-24 rounded-full bg-white/20 flex items-center justify-center border border-white/30 animate-pulse">
            <User className="size-12 text-white" />
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-xs text-white/60">
        © {new Date().getFullYear()} SpotQ Platform. All rights reserved.
      </div>
    </div>
  );
};
