import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import { useRouter } from "next/router";

const { Header } = Layout;

export const Navbar = () => {
  const router = useRouter();
  return (
    <Layout className="layout">
      <Header style={{ backgroundColor: "#fff", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Image alt="Roommate Easy Logo" src={"/logo.png"} width="200" height="30" onClick={() => router.push("/dashboard")} />
        <SignOutButton />
      </Header>
    </Layout>
  );
};
