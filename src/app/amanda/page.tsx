"use client";

import { useCallback, useEffect, useRef } from "react";

import { Typography } from "antd";
import { PDFDocument } from "pdf-lib";

import { AmandaPdfForm } from "@src/components/Form";
import * as generator from "@src/generator";

import styles from "./page.module.css";

const { Text, Title } = Typography;

export default function AmandaHome() {
  const visualizer = useRef<HTMLIFrameElement>(null);
  const pdfCached = useRef<ArrayBuffer | null>(null);

  const getPdfDoc = useCallback(async () => {
    if (!pdfCached.current) {
      const pdfBuffer = await fetch("/pdf/amanda/v1-min.pdf", {
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

    mainPage.drawText(
      `Eu, Amanda de Oliveira Martins, portadora do RG 41.576.418-1 e CPF 368.017.198-66, Registro Profissional 06/177011, declaro que recebi do(a) Sr(a). Christian Gomes de O. Sanches do CPF 459.758.428-59 o valor de R$176,00 referente aos atendimentos de psicoterapia realizados nos dias:\n \n 01/02/2024`,
      {
        x: 50,
        y: 600,
        size: 14,
        maxWidth: mainPage.getWidth() - 50,
      },
    );

    mainPage.drawText(`Jundiaí, 01 de fevereiro de 2024`, {
      x: 370,
      y: 370,
      size: 12,
      maxWidth: mainPage.getWidth() - 50 - 370,
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
    values: generator.IAmandaData,
    download?: boolean,
  ) => {
    const defaultText = generator.generateDefaultText(values);
    const signatureText = generator.generateSignatureDate(values);

    const pdfDoc = await getPdfDoc();

    const mainPage = pdfDoc.getPage(0);

    mainPage.drawText(defaultText, {
      x: 50,
      y: 600,
      size: 14,
      maxWidth: mainPage.getWidth() - 50,
    });

    mainPage.drawText(signatureText, {
      x: 370,
      y: 370,
      size: 12,
      maxWidth: mainPage.getWidth() - 50 - 370,
    });

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
      <Title level={1}>Gerador de Recibos - Amanda</Title>

      <AmandaPdfForm
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
