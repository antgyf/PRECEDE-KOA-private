import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask, TextLayer } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";
import "./inlinePdf.css";

interface LoadedPdf {
  document: PDFDocumentProxy;
  TextLayer: typeof TextLayer;
}

function PdfPage({ pdf, number, width, language }: {
  pdf: LoadedPdf;
  number: number;
  width: number;
  language: string;
}) {
  const page = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(210 / 297);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const chinese = language === "zh";

  useEffect(() => {
    const container = page.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "250px 0px",
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const surface = canvas.current;
    const textContainer = text.current;
    if (!visible || !width || !surface || !textContainer) return;

    let cancelled = false;
    let renderTask: RenderTask | undefined;
    let textLayer: TextLayer | undefined;
    setStatus("loading");

    async function renderPage(surface: HTMLCanvasElement, container: HTMLDivElement) {
      try {
        const pdfPage = await pdf.document.getPage(number);
        if (cancelled) return;

        const size = pdfPage.getViewport({ scale: 1 });
        const viewport = pdfPage.getViewport({ scale: width / size.width });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        setAspectRatio(size.width / size.height);
        surface.width = Math.ceil(viewport.width * pixelRatio);
        surface.height = Math.ceil(viewport.height * pixelRatio);
        renderTask = pdfPage.render({
          canvas: surface,
          viewport,
          transform: [pixelRatio, 0, 0, pixelRatio, 0, 0],
        });

        await renderTask.promise;
        if (cancelled) return;
        setStatus("ready");
        container.style.setProperty("--total-scale-factor", String(viewport.scale));
        textLayer = new pdf.TextLayer({ textContentSource: pdfPage.streamTextContent(), container, viewport });
        await textLayer.render();
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to render PDF page:", error);
        setStatus((previous) => previous === "ready" ? previous : "error");
      }
    }

    void renderPage(surface, textContainer);
    return () => {
      cancelled = true;
      renderTask?.cancel();
      textLayer?.cancel();
      textContainer.replaceChildren();
      surface.width = 0;
      surface.height = 0;
    };
  }, [pdf, number, width, visible]);

  return (
    <div
      ref={page}
      role="group"
      aria-label={chinese ? `第 ${number} 页` : `Page ${number}`}
      aria-busy={visible && status === "loading"}
      className="relative w-full overflow-hidden bg-white shadow-sm"
      style={{ aspectRatio }}
    >
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 block h-full w-full" data-rendered={visible && status === "ready"} />
      <div ref={text} className="report-pdf-text" />
      {visible && status === "error" && (
        <p className="p-4 text-gray-900" role="alert">
          {chinese ? "无法预览此页。请下载 PDF 查看。" : "This page could not be displayed. Download the PDF to view it."}
        </p>
      )}
    </div>
  );
}

export default function InlinePdfPreview({ blob, language }: { blob: Blob; language: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pdf, setPdf] = useState<LoadedPdf | null>();
  const chinese = language === "zh";

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | undefined;

    async function loadPdf() {
      try {
        const [pdfjs, bytes] = await Promise.all([
          import("pdfjs-dist/legacy/build/pdf.mjs"),
          blob.arrayBuffer(),
        ]);
        if (cancelled) return;

        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes), useWasm: false });
        const document = await loadingTask.promise;
        if (!cancelled) setPdf({ document, TextLayer: pdfjs.TextLayer });
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to open PDF preview:", error);
        setPdf(null);
      }
    }

    void loadPdf();
    return () => {
      cancelled = true;
      void loadingTask?.destroy().catch(() => {});
    };
  }, [blob]);

  return (
    <section
      ref={container}
      aria-label={chinese ? "PDF 预览" : "PDF preview"}
      className="grid w-full max-w-3xl gap-3"
    >
      {pdf === undefined && <p role="status">{chinese ? "正在加载 PDF 预览…" : "Loading PDF preview…"}</p>}
      {pdf === null && <p role="alert">{chinese ? "无法预览报告。请下载 PDF 查看。" : "Could not display the report inline. Download the PDF to view it."}</p>}
      {pdf && Array.from({ length: pdf.document.numPages }, (_, index) => (
        <PdfPage key={index} pdf={pdf} number={index + 1} width={width} language={language} />
      ))}
    </section>
  );
}
