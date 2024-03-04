import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { z } from "zod";

const dataSchema = z.object({
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

export interface IData extends z.infer<typeof dataSchema> {}

export const generateDefaultText = (data: IData): string => {
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
  text += " referente aos atendimentos de psicoterapia realizados nos dias:\n \n";
  text += data.sessionDate || new Date().toLocaleDateString("pt-BR");

  return text;
}

export const currentDate = () => format(new Date(), "dd_MM_yyyy", { locale: ptBR });

export const pacientFirstAndLastName = (name: string) => {
  const names = name.split(" ");
  return `${names[0]}_${names[names.length - 1]}`.toLowerCase();
}

export const generateSignatureDate = (data: IData): string => {
  let text = "";
  const currentFormattedDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  text += data.signature.city || "Jundiaí";
  text += ", ";
  text += data.signature.sameAsSessionDate ?
    data.sessionDate || currentFormattedDate :
    data.signature.date || currentFormattedDate;

  return text
}