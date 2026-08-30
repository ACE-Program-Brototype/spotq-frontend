import type { ReactNode } from "react";

interface StaffAuthCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export function StaffAuthCard({ icon, title, description, children }: StaffAuthCardProps) {
  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-[#EFE8E2] bg-white p-7 sm:p-9 shadow-sm">
      {/* Icon Badge */}
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#FAF0EB] text-[#9E460E]">
        {icon}
      </div>

      {/* Heading and Description */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
      </div>

      {/* Form Content */}
      {children}
    </div>
  );
}

export default StaffAuthCard;
