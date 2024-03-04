'use client'

import { PdfForm } from "@src/components/Form";
import * as generator from '@src/generator';
import { Typography } from "antd";
import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {

  const visualizer = useRef<HTMLIFrameElement>(null)

  const downloadURL = useCallback((data: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style.display = "none";
    a.click();
    a.remove();
  }, []);

  const getPdfDoc = useCallback(async () => {
    const pdfBuffer = await fetch("/pdf/amanda/v1.pdf").then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    return pdfDoc
  }, []);

  const fetchPdf = useCallback(async () => {
    const pdfDoc = await getPdfDoc();

    const mainPage = pdfDoc.getPage(0);

    mainPage.drawText(`Eu, Amanda de Oliveira Martins, portadora do RG 41.576.418-1 e CPF 368.017.198-66, Registro Profissional 06/177011, declaro que recebi do(a) Sr(a). Christian Gomes de O. Sanches do CPF 459.758.428-59 o valor de R$176,00 referente aos atendimentos de psicoterapia realizados nos dias:\n \n 01/02/2024`, {
      x: 50,
      y: 600,
      size: 14,
      maxWidth: mainPage.getWidth() - 50,
    });

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

  const handleSubmitForm = async (values: generator.IData, download?: boolean) => {

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
      downloadURL(url, 
        `recibo-${
          generator.pacientFirstAndLastName(values.pacient.name || "Fulano de Tal")
        }-${
          values.sessionDate ? values.sessionDate.split("/").join("_") : generator.currentDate()
        }.pdf`);
    }

  }

  return (
    <main className={styles.main}>
      <Typography.Title level={1}>Gerador de Recibos</Typography.Title>

      <PdfForm onFinish={handleSubmitForm} downloadPdf={(data) => handleSubmitForm(data, true)} />
      <iframe className={styles.description} ref={visualizer} />

      <footer>
        <Typography.Text>
          Feito com 💜 por <a href="mailto:christian@fleflis.dev">Christian Sanches</a> 👨🏻‍💻
        </Typography.Text>
      </footer>
      
    </main>
  );
}
