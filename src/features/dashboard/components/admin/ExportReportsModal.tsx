import { Download, FileSpreadsheet, FileText, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EXPORT_FORMATS,
  EXPORT_REPORT_TYPES,
  type ExportFormat,
  type ExportReportType,
} from "@/features/dashboard/constants/platform-analytics.constants";

export interface ExportReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportReportsModal({ isOpen, onClose }: ExportReportsModalProps) {
  const [reportType, setReportType] = useState<ExportReportType>(EXPORT_REPORT_TYPES.FINANCE);
  const [format, setFormat] = useState<ExportFormat>(EXPORT_FORMATS.CSV);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    // Placeholder trigger wired for SCRUM-260 backend integration
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close export modal"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Download className="size-4" />
          </div>
          <div>
            <h3 id="export-modal-title" className="text-base font-bold text-slate-900">
              Export Analytics Reports
            </h3>
            <p className="text-xs text-slate-500">
              Export platform performance data for external audit
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {/* Report Type Selection */}
          <div>
            <p className="text-xs font-semibold text-slate-700 block mb-2">Select Report Dataset</p>
            <div className="space-y-2">
              {[
                {
                  id: EXPORT_REPORT_TYPES.FINANCE,
                  name: "Platform Finance & Revenue Ledger",
                  desc: "MRR, ARR, subscription invoices, and settlement intake",
                },
                {
                  id: EXPORT_REPORT_TYPES.GROWTH,
                  name: "Restaurant Growth & Onboarding",
                  desc: "Onboarding progression, partner verification, and regional counts",
                },
                {
                  id: EXPORT_REPORT_TYPES.CUSTOMERS,
                  name: "Customer Acquisition & Users",
                  desc: "Consumer base metrics and registration timelines",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                    reportType === item.id
                      ? "border-slate-900 bg-slate-50/70"
                      : "border-slate-200 hover:bg-slate-50/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={item.id}
                    checked={reportType === item.id}
                    onChange={() => setReportType(item.id as typeof reportType)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{item.name}</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">{item.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <p className="text-xs font-semibold text-slate-700 block mb-2">File Format</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat(EXPORT_FORMATS.CSV)}
                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                  format === EXPORT_FORMATS.CSV
                    ? "border-slate-900 bg-slate-900 text-white font-semibold"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileSpreadsheet className="size-4" />
                CSV Spreadsheet
              </button>
              <button
                type="button"
                onClick={() => setFormat(EXPORT_FORMATS.PDF)}
                className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                  format === EXPORT_FORMATS.PDF
                    ? "border-slate-900 bg-slate-900 text-white font-semibold"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FileText className="size-4" />
                PDF Document
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Workflow: SCRUM-804 Modal UI</span>
            <Badge variant="outline" className="text-[10px] text-slate-600">
              SCRUM-260 API
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isExporting}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-slate-900 text-white hover:bg-slate-800 text-xs gap-1.5"
          >
            {isExporting ? (
              "Generating Report..."
            ) : exportComplete ? (
              "Report Queued!"
            ) : (
              <>
                <Download className="size-3.5" />
                Generate &amp; Download
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
