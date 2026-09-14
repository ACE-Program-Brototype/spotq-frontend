import {
  AlertCircle,
  ArrowLeft,
  FileCheck2,
  ImageIcon,
  RefreshCw,
  Store,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RestaurantDetailsHeader } from "../components/details/RestaurantDetailsHeader";
import { RestaurantDocumentsTab } from "../components/details/RestaurantDocumentsTab";
import { RestaurantImagesTab } from "../components/details/RestaurantImagesTab";
import { RestaurantOverviewTab } from "../components/details/RestaurantOverviewTab";
import { RestaurantStaffTab } from "../components/details/RestaurantStaffTab";
import { RESTAURANT_MESSAGES } from "../constants/restaurant.constants";
import { useAdminRestaurantDetails } from "../hooks/useAdminRestaurantDetails";

export type RestaurantDetailsTabType = "overview" | "staff" | "documents" | "images";

export function AdminRestaurantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RestaurantDetailsTabType>("overview");

  const { restaurant, isLoading, isError, error, refetch, isFetching } =
    useAdminRestaurantDetails(id);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="admin-restaurant-details-loading">
        <div className="h-9 w-36 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-28 w-full rounded-2xl bg-slate-100 animate-pulse" />
        <div className="py-12">
          <LoadingIndicator
            variant="table-skeleton"
            theme="admin"
            text="Loading restaurant details and documents..."
          />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError || !restaurant) {
    return (
      <div className="space-y-6" data-testid="admin-restaurant-details-error">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/restaurants")}
            className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 text-xs font-semibold"
          >
            <ArrowLeft className="size-4" />
            {RESTAURANT_MESSAGES.DETAILS_BACK_BUTTON}
          </Button>
        </div>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="py-16 text-center">
            <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {isError
                ? RESTAURANT_MESSAGES.DETAILS_ERROR_TITLE
                : RESTAURANT_MESSAGES.DETAILS_NOT_FOUND_TITLE}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {error?.message || RESTAURANT_MESSAGES.DETAILS_NOT_FOUND_DESCRIPTION}
            </p>
            {id && <p className="font-mono text-xs text-slate-400 mt-2">ID: {id}</p>}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/restaurants")}
                className="rounded-xl text-xs font-bold"
              >
                Back to List
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                {RESTAURANT_MESSAGES.RETRY_BUTTON}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const staffCount = restaurant.staff?.length ?? 0;
  const documentsCount = restaurant.documents?.length ?? 0;
  const imagesCount = restaurant.images?.length ?? 0;

  const tabs: {
    id: RestaurantDetailsTabType;
    label: string;
    icon: typeof Store;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: RESTAURANT_MESSAGES.DETAILS_TAB_OVERVIEW,
      icon: Store,
    },
    {
      id: "staff",
      label: RESTAURANT_MESSAGES.DETAILS_TAB_STAFF,
      icon: Users,
      count: staffCount,
    },
    {
      id: "documents",
      label: RESTAURANT_MESSAGES.DETAILS_TAB_DOCUMENTS,
      icon: FileCheck2,
      count: documentsCount,
    },
    {
      id: "images",
      label: RESTAURANT_MESSAGES.DETAILS_TAB_IMAGES,
      icon: ImageIcon,
      count: imagesCount,
    },
  ];

  return (
    <div className="space-y-6" data-testid="admin-restaurant-details-page">
      {/* Header */}
      <RestaurantDetailsHeader restaurant={restaurant} />

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav
          className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none"
          aria-label="Restaurant Details Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "border-[#ff6b00] text-[#ff6b00]"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <Icon
                  className={`size-4 transition-colors ${
                    isActive ? "text-[#ff6b00]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                      isActive
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === "overview" && <RestaurantOverviewTab restaurant={restaurant} />}
        {activeTab === "staff" && <RestaurantStaffTab staff={restaurant.staff} />}
        {activeTab === "documents" && <RestaurantDocumentsTab documents={restaurant.documents} />}
        {activeTab === "images" && <RestaurantImagesTab images={restaurant.images} />}
      </div>
    </div>
  );
}

export default AdminRestaurantDetailsPage;
