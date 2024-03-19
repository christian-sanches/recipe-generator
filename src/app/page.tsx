"use client";

import { Space, Typography } from "antd";
import Link from "next/link";

const { Title } = Typography;

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Space direction="vertical">
        <Title level={2}>Gerador de recibos para psicólogas - POC</Title>
        <Title level={5} style={{ textAlign: "center" }}>
          <Link href="/amanda">Amanda</Link>
        </Title>
        <Title level={5} style={{ textAlign: "center" }}>
          <Link href="/raquel">Raquel</Link>
        </Title>
      </Space>
    </main>
  );
}
