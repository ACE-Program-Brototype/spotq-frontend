import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MediaPreviewModal } from "@/components/common/MediaPreviewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePresignedUrl } from "../../hooks/usePresignedUrl";
import type { ApplicationDocument } from "../../types/restaurant-application.types";

export interface ApplicationDocumentsTabProps {
  documents?: ApplicationDocument[];
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
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

function getDocumentTypeBadge(type: string) {
  const normalized = type.toUpperCase();
  switch (normalized) {
    case "FSSAI":
    case "FSSAI_LICENSE":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
          FSSAI License
        </Badge>
      );
    case "GST":
    case "GST_CERTIFICATE":
      return (
        <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs">GST Certificate</Badge>
      );
    case "BUSINESS_PAN":
    case "PAN_CARD":
      return (
        <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-xs">Business PAN</Badge>
      );
    case "BUSINESS_REGISTRATION":
      return (
        <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-xs">Business Reg.</Badge>
      );
    case "OWNER_IDENTITY":
    case "ID_PROOF":
      return (
        <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-xs">Owner Identity</Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-xs">
          {type.replace(/_/g, " ")}
        </Badge>
      );
  }
}

function renderVerificationStatus(status: string) {
  const normalized = status.toUpperCase();
  switch (normalized) {
    case "APPROVED":
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="size-3 text-emerald-600" />
          VERIFIED
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="size-3 text-amber-600" />
          PENDING REVIEW
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <ShieldAlert className="size-3 text-rose-600" />
          REJECTED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

function ApplicationDocumentCard({
  doc,
  onOpenPreview,
}: {
  doc: ApplicationDocument;
  onOpenPreview: (url: string, title: string, badge: string, date: string) => void;
}) {
  const { data: docUrl, isLoading: isDocLoading } = usePresignedUrl(doc.document_key);
  const formattedDate = formatDate(doc.uploaded_at);

  const handlePreview = () => {
    try {
      if (docUrl) {
        onOpenPreview(docUrl, doc.document_name, doc.document_type, formattedDate);
      }
    } catch {
      toast.error("Failed to preview document");
    }
  };

  const handleDownload = () => {
    try {
      if (docUrl) {
        window.open(docUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast.error("Failed to download document");
    }
  };

  return (
    <Card
      className="border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between"
      data-testid={`document-card-${doc.id}`}
    >
      <CardHeader className="pb-3 pt-4 px-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-9 shrink-0 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm font-bold text-slate-900 truncate">
                {doc.document_name}
              </CardTitle>
              <div className="mt-1">{getDocumentTypeBadge(doc.document_type)}</div>
            </div>
          </div>

          {renderVerificationStatus(doc.verification_status)}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="size-3.5 text-slate-400" />
          <span className="text-[11px]">Uploaded: {formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {docUrl ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="gap-1.5 text-xs font-semibold text-[#ff6b00] hover:text-[#e05e00] border-orange-200 hover:bg-orange-50 cursor-pointer"
                data-testid={`preview-doc-btn-${doc.id}`}
              >
                <Eye className="size-3.5" />
                Preview
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="Open in new tab / Download"
                data-testid={`download-doc-btn-${doc.id}`}
              >
                <Download className="size-3.5" />
              </Button>
            </>
          ) : isDocLoading ? (
            <span className="text-[11px] text-slate-400 animate-pulse">Loading URL...</span>
          ) : (
            <span className="text-[11px] text-slate-400">Unavailable</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationDocumentsTab({ documents = [] }: ApplicationDocumentsTabProps) {
  const [previewState, setPreviewState] = useState<{
    isOpen: boolean;
    src?: string;
    title?: string;
    badge?: string;
    subtitle?: string;
  }>({
    isOpen: false,
  });

  const handleOpenPreview = (src: string, title: string, badge: string, date: string) => {
    setPreviewState({
      isOpen: true,
      src,
      title,
      badge,
      subtitle: `Uploaded on ${date}`,
    });
  };

  const handleClosePreview = () => {
    setPreviewState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6" data-testid="application-documents-tab">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">Submitted Verification Documents</h2>
            <Badge variant="secondary" className="font-mono text-xs">
              {documents.length} Submitted
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect official business certificates, regulatory registrations, and licenses
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <Card className="border-slate-200/80 shadow-xs bg-white">
          <CardContent className="py-14 text-center">
            <div className="size-12 mx-auto mb-3 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileCheck2 className="size-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No verification documents attached</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              This onboarding application has no compliance certificates uploaded.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <ApplicationDocumentCard key={doc.id} doc={doc} onOpenPreview={handleOpenPreview} />
          ))}
        </div>
      )}

      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
        src={previewState.src}
        title={previewState.title}
        badge={previewState.badge}
        subtitle={previewState.subtitle}
        type="pdf"
      />
    </div>
  );
}
