"use client";

import { useCallback, useEffect, useRef } from "react";

import { Typography } from "antd";
import { PDFDocument } from "pdf-lib";

import { RaquelPdfForm } from "@src/components/Form";

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

    mainPage.drawText("235,37", {
      x: 130,
      y: 215,
      size: 13,
    });

    mainPage.drawText(
      "Pamella Fernanda Pietromonaco de Oliveira Sanches, Christian Gomes de Oliveira Sanches",
      {
        x: 90,
        y: 185,
        size: 12,
        maxWidth: mainPage.getWidth() - 120,
        lineHeight: 15,
      },
    );

    mainPage.drawText(
      "Duzendos e trinta e cinco reais e trinta e sete centavos",
      {
        x: 105,
        y: 152,
        size: 12,
        maxWidth: mainPage.getWidth() - 120,
      },
    );

    mainPage.drawText(
      "Atendimento psicológico no mês de Janeiro, no dia 01/01/2024",
      {
        x: 100,
        y: 135,
        size: 12,
        maxWidth: mainPage.getWidth() - 120,
        lineHeight: 15,
      },
    );

    mainPage.drawText("Jundiaí", {
      x: 40,
      y: 85,
      size: 12,
    });

    mainPage.drawText("01", {
      y: 85,
      x: 155,
      size: 12,
    });

    mainPage.drawText("Janeiro", {
      y: 85,
      x: 200,
      size: 12,
    });

    mainPage.drawText("24", {
      y: 85,
      x: 330,
      size: 12,
    });

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

      <RaquelPdfForm onFinish={console.log} downloadPdf={console.log} />
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
