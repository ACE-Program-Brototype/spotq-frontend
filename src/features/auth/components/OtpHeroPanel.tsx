import { LockKeyhole, ShieldCheck } from "lucide-react";
import spotqLogo from "@/assets/logos/spotq-logo.png";

export const OtpHeroPanel = () => {
  return (
    <div className="hidden md:flex md:w-1/2 bg-spotq-orange text-white p-9 lg:p-12 flex-col relative overflow-hidden select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-lg p-2 shadow-md">
          <img src={spotqLogo} alt="SpotQ Logo" className="h-6 w-auto" />
        </div>

        <span className="font-bold text-lg tracking-wide">SpotQ</span>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-center max-w-lg">
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Secure your spot.</h1>

          <p className="text-sm leading-relaxed text-white/85 max-w-md">
            Connecting your culinary passion with seamless digital protection.
          </p>
        </div>

        {/* Security illustration */}
        <div className="mt-10">
          <div
            className="
              relative
              w-full
              max-w-[360px]
              aspect-[1.45]
              rounded-2xl
              bg-white/10
              border
              border-white/15
              shadow-2xl
              flex
              items-center
              justify-center
              overflow-hidden
            "
          >
            {/* Decorative dot */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2">
              <div className="size-2.5 rounded-full bg-white/20" />
            </div>

            {/* Shield */}
            <div className="relative flex items-center justify-center">
              <ShieldCheck
                className="
                  size-24
                  lg:size-28
                  text-white
                  fill-white
                "
                strokeWidth={1.2}
              />

              {/* Lock */}
              <LockKeyhole
                className="
                  absolute
                  size-9
                  lg:size-10
                  text-spotq-orange
                  fill-spotq-orange
                "
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
