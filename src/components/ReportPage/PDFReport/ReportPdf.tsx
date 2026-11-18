import { pdf, type DocumentProps } from "@react-pdf/renderer";
import { useEffect, useState, type ReactElement } from "react";
import InlinePdfPreview from "./InlinePdfPreview";

interface Props {
  document: ReactElement<DocumentProps>;
  fileName: string;
  language: string;
  onEmail?: (blob: Blob) => void;
}

type GeneratedReport = { document: Props["document"] } & (
  { blob: Blob; url: string } | { error: true }
);

export default function ReportPdf({ document, fileName, language, onEmail }: Props) {
  const [report, setReport] = useState<GeneratedReport>();
  const currentReport = report?.document === document ? report : undefined;
  const chinese = language === "zh";

  useEffect(() => {
    let cancelled = false;
    let url: string | undefined;

    async function generateReport() {
      try {
        const blob = await pdf(document).toBlob();
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setReport({ document, blob, url });
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to generate PDF report:", error);
        setReport({ document, error: true });
      }
    }

    void generateReport();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [document]);

  if (!currentReport) {
    return <p className="py-4" role="status">{chinese ? "正在生成 PDF…" : "Generating PDF…"}</p>;
  }
  if ("error" in currentReport) {
    return <p className="py-4" role="alert">{chinese ? "无法生成 PDF。请重新加载报告。" : "Could not generate the PDF. Reload the report to try again."}</p>;
  }

  const { blob, url } = currentReport;
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        <a className="btn btn-primary" href={url} download={fileName}>
          {chinese ? "下载 PDF" : "Download PDF"}
        </a>
        {onEmail && (
          <button type="button" className="btn bg-green-600 text-white hover:bg-green-700" onClick={() => onEmail(blob)}>
            {chinese ? "通过电子邮件发送报告" : "Email My Report"}
          </button>
        )}
      </div>
      <InlinePdfPreview key={url} blob={blob} language={language} />
    </div>
  );
}
