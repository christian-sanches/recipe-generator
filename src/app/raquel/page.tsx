"use client";

import { useCallback, useEffect, useRef } from "react";

import { Typography } from "antd";
import { PDFDocument } from "pdf-lib";

import { RaquelPdfForm } from "@src/components/Form";
import * as generator from "@src/generator";
import { renderRaquelData } from "@src/renderer/raquel";

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

    renderRaquelData(mainPage, {
      value: "200,00",
      valueInWords: "duzentos reais",
      pacientName: "Fulano de Tal",
      description: "Atendimento psicológico",
      city: "Jundiaí",
      day: "01",
      fullMonth: "fevereiro",
      lastDigitsYear: "24",
    });

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    if (visualizer.current) {
      visualizer.current.src = pdfDataUri;
    }
  }, [getPdfDoc]);

  useEffect(() => {
    fetchPdf();
  }, [fetchPdf]);

  const handleSubmitForm = async (
    values: generator.IRaquelData,
    download?: boolean,
  ) => {
    const pdfDoc = await getPdfDoc();

    const mainPage = pdfDoc.getPage(0);

    renderRaquelData(mainPage, generator.generateRaquelData(values));

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    if (visualizer.current) {
      visualizer.current.src = pdfDataUri;
    }

    const pdfData = await pdfDoc.save();
    const pdfBlob = new Blob([pdfData], { type: "application/pdf" });

    const url = URL.createObjectURL(pdfBlob);

    if (download) {
      generator.downloadURL(
        url,
        `recibo-${generator.pacientFirstAndLastName(
          values.pacient.name || "Fulano de Tal",
        )}-${
          values.sessionDate
            ? values.sessionDate.split("/").join("_")
            : generator.currentDate()
        }.pdf`,
      );
    }
  };

  return (
    <main className={styles.main}>
      <Title level={1}>Gerador de Recibos - Raquel</Title>

      <RaquelPdfForm
        onFinish={handleSubmitForm}
        downloadPdf={(data) => handleSubmitForm(data, true)}
      />
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
