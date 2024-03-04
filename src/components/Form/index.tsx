'use client'

import { Button, Divider, Form, Input, Space, Switch, Typography } from "antd";
import React from "react";

export const PdfForm: React.FC<{onFinish?: (values: any) => void}> = ({onFinish}) => {

  const [formInstance] = Form.useForm();


  return (
    <Form layout="vertical" form={formInstance} onFinish={onFinish} style={{
      width: "40%",
      minWidth: "350px"
    }}>
      <Typography.Title level={4}>Dados do Psicólogo</Typography.Title>
      <Form.Item label="Nome" name={"psychologist.name".split(".")} >
        <Input placeholder="Padrão: Amanda de Oliveira Martins" />
      </Form.Item>
      <Form.Item label="RG" name={"psychologist.rg".split(".")}>
        <Input placeholder="Padrão: Aleatório" />
      </Form.Item>
      <Form.Item label="CPF" name={"psychologist.cpf".split(".")}>
        <Input placeholder="Padrão: Aleatório" />
      </Form.Item>
      <Form.Item label="CRP" name={"psychologist.crp".split(".")}>
        <Input placeholder="Padrão: CRP da Amanda" />
      </Form.Item>

      <Divider type="horizontal" />
      <Typography.Title level={4}>Dados do Paciente e da Sessão</Typography.Title>
      <Form.Item label="Nome do Paciente" name={"pacient.name".split(".")}>
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="CPF Paciente" name={"pacient.cpf".split(".")}>
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Valor" name="value">
        <Input placeholder="" />
      </Form.Item>
      <Form.Item label="Data de Atendimento" name="sessionDate">
        <Input placeholder="Padrão: Data de Hoje" />
      </Form.Item>

      <Divider type="horizontal" />
      <Typography.Title level={4}>Diversos</Typography.Title>
      
      <Form.Item label="Cidade da Assinatura" name={"signature.city".split(".")}>
        <Input placeholder="Padrão: Jundiaí" />
      </Form.Item>
      <Form.Item label="Data de Assinatura" name={"signature.date".split(".")}>
        <Input placeholder="Padrão: Data de Hoje, por extenso" />
      </Form.Item>
      <Form.Item label="Usar a mesma data do atendimento" name={"signature.sameAsSessionDate".split(".")}>
        <Switch defaultChecked />
      </Form.Item>
      <Form.Item label="Texto customizado" help="Cuidado, ao completar este campo, todo o padrão de recibo será substituido!" name="customText">
        <Input.TextArea placeholder="Caso queira fazer um recibo ou nota diferente, escreva o texto todo aqui." />
      </Form.Item>

      <Form.Item>
        <Space style={{marginTop: "1rem"}}>
          <Button type="primary" htmlType="submit">Gerar PDF</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}