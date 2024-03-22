import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { z } from "zod";

import { IRaquelDataForRender } from "@src/renderer/raquel";

/**
 * Return list of months
 * 🌍 localeName   : name of local, f.e. en-GB, default es-MX
 *  ✅ monthFormat : short, numeric, long (Default)
 */
export function monthsForLocale(localeName = "pt-BR") {
  const innFormat = new Intl.DateTimeFormat(localeName, { month: "long" })
    .format;
  return Array.from({ length: 12 }).map((_, m) =>
    innFormat(new Date(Date.UTC(2021, (m + 1) % 12))),
  );
}

const AmandaDataSchema = z.object({
  psychologist: z.object({
    name: z.string().optional(),
    rg: z.string().optional(),
    cpf: z.string().optional(),
    crp: z.string().optional(),
  }),
  pacient: z.object({
    name: z.string().optional(),
    cpf: z.string().optional(),
  }),
  value: z.string().optional(),
  sessionDate: z.string().optional(),
  signature: z.object({
    city: z.string().optional(),
    date: z.string().optional(),
    sameAsSessionDate: z.boolean().optional(),
  }),
  customText: z.string().optional(),
});

export interface IAmandaData extends z.infer<typeof AmandaDataSchema> {}

export const generateDefaultText = (data: IAmandaData): string => {
  if (data.customText) return data.customText;
  let text = "Eu, ";

  // Psychologist details
  text += data.psychologist.name || "Amanda de Oliveira Martins";
  text += ", portadora do RG ";
  text += data.psychologist.rg || "12.345.678-9";
  text += " e CPF ";
  text += data.psychologist.cpf || "111.111.111-11";
  text += ", Registro Profissional ";
  text += data.psychologist.crp || "06/177011";

  // Pacient and session details
  text += ", declaro que recebi do(a) Sr(a). ";
  text += data.pacient.name || "Fulano de Tal";
  text += " do CPF ";
  text += data.pacient.cpf || "000.000.000-00";
  text += " o valor de R$";
  text += data.value || "1,99";
  text +=
    " referente aos atendimentos de psicoterapia realizados nos dias:\n \n";
  text += data.sessionDate || new Date().toLocaleDateString("pt-BR");

  return text;
};

export const currentDate = () =>
  format(new Date(), "dd_MM_yyyy", { locale: ptBR });

export const pacientFirstAndLastName = (name: string) => {
  const names = name.split(" ");
  return `${names[0]}_${names[names.length - 1]}`.toLowerCase();
};

export const generateSignatureDate = (data: IAmandaData): string => {
  let text = "";
  const currentFormattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  text += data.signature.city || "Jundiaí";
  text += ", ";
  text += data.signature.sameAsSessionDate
    ? data.sessionDate || currentFormattedDate
    : data.signature.date || currentFormattedDate;

  return text;
};

const RaquelDataSchema = z.object({
  pacient: z.object({
    name: z.string().optional(),
  }),
  value: z.string().optional(),
  valueInWords: z.string().optional(),
  sessionDate: z.string().optional(),
  description: z.string().optional(),
  signature: z.object({
    city: z.string().optional(),
  }),
});

export interface IRaquelData extends z.infer<typeof RaquelDataSchema> {}

export const generateRaquelData = (data: IRaquelData): IRaquelDataForRender => {
  let day, fullMonth, lastDigitsYear;

  if (data.sessionDate && data.sessionDate.split("/").length === 3) {
    const [innerDay, month, year] = data.sessionDate.split("/");
    day = innerDay;
    fullMonth = monthsForLocale()[parseInt(month) - 1];
    lastDigitsYear = year.slice(2);
  } else {
    const currentDate = new Date();
    day = currentDate.getDate().toString();
    fullMonth = monthsForLocale()[currentDate.getMonth()];
    lastDigitsYear = currentDate.getFullYear().toString().slice(2);
  }

  return {
    value: data.value || "200,00",
    valueInWords: data.valueInWords || "duzentos reais",
    pacientName: data.pacient.name || "Fulano de Tal",
    description: data.description || "",
    city: data.signature.city || "Jundiaí",
    day,
    fullMonth,
    lastDigitsYear,
  };
};

export const downloadURL = (data: string, fileName: string) => {
  const a = document.createElement("a");
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = "none";
  a.click();
  a.remove();
};
