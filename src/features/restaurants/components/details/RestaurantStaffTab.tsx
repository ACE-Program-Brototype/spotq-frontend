import { Mail, Phone, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { RestaurantStaffMember } from "../../types/restaurant.types";

interface RestaurantStaffTabProps {
  staff?: RestaurantStaffMember[];
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || "ST";
}

export function RestaurantStaffTab({ staff = [] }: RestaurantStaffTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = useMemo(() => {
    if (!searchTerm.trim()) return staff;
    const term = searchTerm.toLowerCase().trim();
    return staff.filter(
      (member) =>
        member.fullname?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term) ||
        member.phone?.toLowerCase().includes(term) ||
        member.role?.toLowerCase().includes(term),
    );
  }, [staff, searchTerm]);

  return (
    <div className="space-y-6" data-testid="restaurant-staff-tab">
      {/* Header with Search & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">Assigned Staff Members</h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {staff.length} Total
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Employees, managers, and service personnel linked to this restaurant branch
          </p>
        </div>

        {staff.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search staff by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl bg-white border-slate-200"
            />
          </div>
        )}
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="py-14 text-center">
            <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Users className="size-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {searchTerm ? "No matching staff members found" : "No staff registered yet"}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? "Try searching with a different name or email."
                : "This restaurant currently has no team members assigned to its roster."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => {
            const isActive = member.status?.toUpperCase() === "ACTIVE";

            return (
              <Card
                key={member.id}
                className="border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all bg-white"
                data-testid={`staff-card-${member.id}`}
              >
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-slate-200 shadow-2xs">
                        {member.avatar_url && (
                          <AvatarImage
                            src={member.avatar_url}
                            alt={member.fullname}
                            className="object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-amber-100 text-amber-800 font-bold text-xs">
                          {getInitials(member.fullname)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <CardTitle className="text-sm font-bold text-slate-900 truncate">
                          {member.fullname}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-600 bg-slate-50 border-slate-200"
                        >
                          {member.role || "STAFF"}
                        </Badge>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          isActive ? "bg-emerald-600" : "bg-slate-400"
                        }`}
                      />
                      {member.status || "UNKNOWN"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 pt-2 border-t border-slate-100/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="size-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${member.email}`}
                      className="truncate hover:text-amber-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="size-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{member.phone || "—"}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                    <span>Joined:</span>
                    <span className="font-medium text-slate-600">
                      {formatDate(member.created_at)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
