'use client'

import { PDFDocument } from "pdf-lib";
import { useCallback, useEffect, useRef } from "react";
import styles from "./page.module.css";

export default function Home() {

  const visualizer = useRef<HTMLIFrameElement>(null)

  const fetchPdf = useCallback(async () => {
    const pdfBuffer = await fetch("/pdf/amanda/v1.pdf").then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const mainPage = pdfDoc.getPage(0);

    mainPage.drawText(`Eu, Amanda de Oliveira Martins, portadora do RG 41.576.418-1 e CPF 368.017.198-66, Registro Profissional 06/177011, declaro que recebi do(a) Sr(a). Christian Gomes de O. Sanches do CPF 459.758.428-59 o valor de R$176,00 referente aos atendimentos de psicoterapia realizados nos dias:\n \n 01/02/2024`, {
      x: 50,
      y: 600,
      size: 14,
      maxWidth: mainPage.getWidth() - 50,
    });

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
