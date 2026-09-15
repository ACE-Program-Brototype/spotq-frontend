import { ArrowLeft, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CUSTOMER_MESSAGES } from "../constants/customer.constants";

export function AdminCustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin/customers");
  };

  return (
    <div className="space-y-6" data-testid="admin-customer-details-page">
      {/* Back Button Navigation */}
      <div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-slate-600 hover:text-slate-900 -ml-2 mb-2"
          data-testid="customer-details-back-btn"
        >
          <ArrowLeft className="size-4" />
          {CUSTOMER_MESSAGES.DETAILS_PAGE_BACK_BUTTON}
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {CUSTOMER_MESSAGES.DETAILS_PAGE_TITLE}
            </h1>
            <Badge variant="outline" className="text-xs font-semibold text-slate-600">
              {CUSTOMER_MESSAGES.DETAILS_PAGE_STATUS_BADGE}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{CUSTOMER_MESSAGES.DETAILS_PAGE_SUBTITLE}</p>
        </div>

        {id && (
          <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">
              {CUSTOMER_MESSAGES.DETAILS_PAGE_CUSTOMER_ID_LABEL}:
            </span>
            <span className="font-mono font-medium" data-testid="customer-details-id">
              {id}
            </span>
          </div>
        )}
      </div>

      {/* Dummy Customer Details Card */}
      <Card className="border-slate-200/80 shadow-xs bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">
            {CUSTOMER_MESSAGES.DETAILS_PAGE_TITLE}
          </CardTitle>
          <CardDescription className="text-xs">
            {CUSTOMER_MESSAGES.DETAILS_PAGE_SUBTITLE}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-xs">
              <User className="size-7" />
            </div>
            <p
              className="text-sm font-semibold text-slate-800"
              data-testid="customer-details-dummy-text"
            >
              {CUSTOMER_MESSAGES.DETAILS_PAGE_DUMMY_TEXT}
            </p>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              {CUSTOMER_MESSAGES.DETAILS_PAGE_CUSTOMER_ID_LABEL}: {id ?? "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminCustomerDetailsPage;
