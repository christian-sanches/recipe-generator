"use client";

import { useCallback, useEffect, useRef } from "react";

import { Typography } from "antd";
import { PDFDocument } from "pdf-lib";

import styles from "./page.module.css";

const { Text, Title } = Typography;

export default function RaquelHome() {
  const visualizer = useRef<HTMLIFrameElement>(null);
  const pdfCached = useRef<ArrayBuffer | null>(null);

  const getPdfDoc = useCallback(async () => {
    if (!pdfCached.current) {
      const pdfBuffer = await fetch("/pdf/raquel/v1-min.pdf", {
        cache: "force-cache",
      }).then((r) => r.arrayBuffer());

      pdfCached.current = pdfBuffer;
    }

    const pdfDoc = await PDFDocument.load(pdfCached.current);

    return pdfDoc;
  }, []);

  const fetchPdf = useCallback(async () => {
    const pdfDoc = await getPdfDoc();

    const mainPage = pdfDoc.getPage(0);

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    if (visualizer.current) {
      visualizer.current.src = pdfDataUri;
    }
  }, [getPdfDoc]);

  useEffect(() => {
    fetchPdf();
  }, [fetchPdf]);

  return (
    <main className={styles.main}>
      <Title level={1}>Gerador de Recibos - Raquel</Title>

      <iframe className={styles.description} ref={visualizer} />

      <footer>
        <Text>
          Feito com 💜 por{" "}
          <a href="mailto:christian@fleflis.dev">Christian Sanches</a> 👨🏻‍💻
        </Text>
      </footer>
    </main>
  );
}
