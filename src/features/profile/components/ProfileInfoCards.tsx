import { Calendar, Mail, Phone, User as UserIcon } from "lucide-react";
import type { ProfileInfoCardsProps } from "../types/profile.types";

export function ProfileInfoCards({ profile }: ProfileInfoCardsProps) {
  // Format Date of Birth
  const formattedDob = profile.dob
    ? (() => {
        try {
          const [year, month, day] = profile.dob.split("-").map(Number);
          if (year && month && day) {
            const date = new Date(Date.UTC(year, month - 1, day));
            return new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            }).format(date);
          }
          return profile.dob;
        } catch {
          return profile.dob;
        }
      })()
    : "Not specified";

  // Format Gender
  const formattedGender = profile.gender
    ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase()
    : "Not specified";

  // Format Phone Number
  const formattedPhone = profile.phone
    ? profile.phone.startsWith("+91") && profile.phone.length === 13
      ? `+91 ${profile.phone.slice(3, 8)} ${profile.phone.slice(8)}`
      : profile.phone
    : "Not provided";

  const cards = [
    {
      id: "email",
      label: "EMAIL ADDRESS",
      value: profile.email || "Not provided",
      icon: Mail,
    },
    {
      id: "phone",
      label: "PHONE NUMBER",
      value: formattedPhone,
      icon: Phone,
    },
    {
      id: "gender",
      label: "GENDER",
      value: formattedGender,
      icon: UserIcon,
    },
    {
      id: "birth-date",
      label: "BIRTH DATE",
      value: formattedDob,
      icon: Calendar,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-neutral-200/80 shadow-xs hover:border-[#fae2ce] transition-colors"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fdf2e9] text-[#8c522f] border border-[#fae2ce]">
              <Icon className="size-5" />
            </div>

            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                {card.label}
              </span>
              <span className="truncate text-sm font-bold text-neutral-800" title={card.value}>
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
