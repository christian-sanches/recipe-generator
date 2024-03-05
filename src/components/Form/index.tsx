"use client";

import { Button, Divider, Form, Input, Space, Switch, Typography } from "antd";
import React from "react";

const { Title } = Typography;
const { Item, useForm } = Form;
const { TextArea } = Input;

export const PdfForm: React.FC<{
  onFinish?: (values: any) => void;
  downloadPdf?: (values: any) => void;
}> = ({ onFinish, downloadPdf }) => {
  const [formInstance] = useForm();

  return (
    <Form
      layout="vertical"
      form={formInstance}
      onFinish={onFinish}
      style={{
        width: "40%",
        minWidth: "350px",
      }}
    >
      <Title level={4}>Dados do Psicólogo</Title>
      <Item label="Nome" name={"psychologist.name".split(".")}>
        <Input placeholder="Padrão: Amanda de Oliveira Martins" />
      </Item>
      <Item label="RG" name={"psychologist.rg".split(".")}>
        <Input placeholder="Padrão: Aleatório" />
      </Item>
      <Item label="CPF" name={"psychologist.cpf".split(".")}>
        <Input placeholder="Padrão: Aleatório" />
      </Item>
      <Item label="CRP" name={"psychologist.crp".split(".")}>
        <Input placeholder="Padrão: CRP da Amanda" />
      </Item>

      <Divider type="horizontal" />
      <Title level={4}>Dados do Paciente e da Sessão</Title>
      <Item label="Nome do Paciente" name={"pacient.name".split(".")}>
        <Input placeholder="" />
      </Item>
      <Item label="CPF Paciente" name={"pacient.cpf".split(".")}>
        <Input placeholder="" />
      </Item>
      <Item label="Valor" name="value">
        <Input placeholder="" />
      </Item>
      <Item label="Data de Atendimento" name="sessionDate">
        <Input placeholder="Padrão: Data de Hoje" />
      </Item>

      <Divider type="horizontal" />
      <Title level={4}>Diversos</Title>

      <Item label="Cidade da Assinatura" name={"signature.city".split(".")}>
        <Input placeholder="Padrão: Jundiaí" />
      </Item>
      <Item label="Data de Assinatura" name={"signature.date".split(".")}>
        <Input placeholder="Padrão: Data de Hoje, por extenso" />
      </Item>
      <Item
        label="Usar a mesma data do atendimento"
        name={"signature.sameAsSessionDate".split(".")}
      >
        <Switch defaultChecked />
      </Item>
      <Item
        label="Texto customizado"
        help="Cuidado: ao preencher este campo, todo o padrão de recibo será substituido!"
        name="customText"
      >
        <TextArea placeholder="Caso queira fazer um recibo ou nota diferente, escreva o texto todo aqui." />
      </Item>

      <Item>
        <Space style={{ marginTop: "1rem" }}>
          <Button type="primary" htmlType="submit">
            Gerar PDF
          </Button>
          <Button type="primary" danger htmlType="reset">
            Limpar campos
          </Button>
          {downloadPdf && (
            <Button
              type="default"
              onClick={() => downloadPdf(formInstance.getFieldsValue())}
            >
              Baixar PDF
            </Button>
          )}
        </Space>
      </Item>
    </Form>
  );
};
