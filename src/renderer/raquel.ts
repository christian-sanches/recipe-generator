import { PDFPage } from "pdf-lib";

export interface IRaquelDataForRender {
  value: string;
  valueInWords: string;
  pacientName: string;
  description: string;
  city: string;
  day: string;
  fullMonth: string;
  lastDigitsYear: string;
}

export const renderRaquelData = (
  page: PDFPage,
  payload: IRaquelDataForRender,
) => {
  page.drawText(payload.value, {
    x: 130,
    y: 215,
    size: 13,
  });

  page.drawText(payload.pacientName, {
    x: 90,
    y: 185,
    size: 12,
    maxWidth: page.getWidth() - 120,
    lineHeight: 15,
  });

  page.drawText(payload.valueInWords, {
    x: 105,
    y: 152,
    size: 12,
    maxWidth: page.getWidth() - 120,
  });

  page.drawText(payload.description, {
    x: 100,
    y: 135,
    size: 12,
    maxWidth: page.getWidth() - 120,
    lineHeight: 15,
  });

  page.drawText(payload.city, {
    x: 40,
    y: 85,
    size: 12,
  });

  page.drawText(payload.day, {
    y: 85,
    x: 155,
    size: 12,
  });

  page.drawText(payload.fullMonth, {
    y: 85,
    x: 200,
    size: 12,
  });

  page.drawText(payload.lastDigitsYear, {
    y: 85,
    x: 330,
    size: 12,
  });
};
