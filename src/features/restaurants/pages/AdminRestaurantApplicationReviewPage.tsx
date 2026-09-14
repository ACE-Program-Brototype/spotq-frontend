import { AlertCircle, ArrowLeft, FileCheck2, ImageIcon, RefreshCw, Store } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicationDocumentsTab } from "../components/applications/ApplicationDocumentsTab";
import { ApplicationImagesTab } from "../components/applications/ApplicationImagesTab";
import { ApplicationOverviewTab } from "../components/applications/ApplicationOverviewTab";
import { ApplicationReviewHeader } from "../components/applications/ApplicationReviewHeader";
import { APPLICATION_MESSAGES } from "../constants/restaurant-application.constants";
import { useRestaurantApplicationDetails } from "../hooks/useRestaurantApplicationDetails";

export type ApplicationReviewTabType = "overview" | "documents" | "images";

export function AdminRestaurantApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ApplicationReviewTabType>("overview");

  const { application, isLoading, isError, error, refetch, isFetching } =
    useRestaurantApplicationDetails(id);

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="application-review-loading">
        <div className="h-9 w-36 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-28 w-full rounded-2xl bg-slate-100 animate-pulse" />
        <div className="py-12">
          <LoadingIndicator
            variant="table-skeleton"
            theme="admin"
            text="Loading restaurant application details and documents..."
          />
        </div>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="space-y-6" data-testid="application-review-error">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/restaurants/onboarding")}
            className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            {APPLICATION_MESSAGES.REVIEW_BACK_BUTTON}
          </Button>
        </div>

        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="py-16 text-center">
            <div className="size-14 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-4 ring-rose-50">
              <AlertCircle className="size-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {isError
                ? APPLICATION_MESSAGES.ERROR_TITLE
                : APPLICATION_MESSAGES.REVIEW_NOT_FOUND_TITLE}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {error?.message || APPLICATION_MESSAGES.REVIEW_NOT_FOUND_DESCRIPTION}
            </p>
            {id && <p className="font-mono text-xs text-slate-400 mt-2">ID: {id}</p>}
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/restaurants/onboarding")}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Back to Applications
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2 bg-[#ff6b00] hover:bg-[#e05e00] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                {APPLICATION_MESSAGES.RETRY_BUTTON}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const documentsCount = application.documents?.length ?? 0;
  const imagesCount = application.images?.length ?? 0;

  const tabs: {
    id: ApplicationReviewTabType;
    label: string;
    icon: typeof Store;
    count?: number;
  }[] = [
    {
      id: "overview",
      label: APPLICATION_MESSAGES.TAB_OVERVIEW,
      icon: Store,
    },
    {
      id: "documents",
      label: APPLICATION_MESSAGES.TAB_DOCUMENTS,
      icon: FileCheck2,
      count: documentsCount,
    },
    {
      id: "images",
      label: APPLICATION_MESSAGES.TAB_IMAGES,
      icon: ImageIcon,
      count: imagesCount,
    },
  ];

  return (
    <div className="space-y-6" data-testid="admin-restaurant-application-review-page">
      {/* Header */}
      <ApplicationReviewHeader application={application} />

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav
          className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto scrollbar-none"
          aria-label="Application Review Tabs"
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
                data-testid={`review-tab-${tab.id}`}
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
                        ? "bg-orange-100 text-orange-800"
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

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "overview" && <ApplicationOverviewTab application={application} />}
        {activeTab === "documents" && <ApplicationDocumentsTab documents={application.documents} />}
        {activeTab === "images" && <ApplicationImagesTab images={application.images} />}
      </div>
    </div>
  );
}

export default AdminRestaurantApplicationReviewPage;
