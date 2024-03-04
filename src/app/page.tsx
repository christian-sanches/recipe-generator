'use client'

import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {

  const visualizer = useRef<HTMLIFrameElement>(null)

  const fetchPdf = useCallback(async () => {
    const pdfBuffer = await fetch("/pdf/amanda/v1.pdf").then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    if (visualizer.current) {
      visualizer.current.src = pdfDataUri;
    }

  }, []);

  useEffect(() => {
    fetchPdf();
  }, [fetchPdf]);

  return (
    <main className={styles.main}>
      <h1>recipe generator</h1>
      <iframe className={styles.description} ref={visualizer} />
      
    </main>
  );
}
