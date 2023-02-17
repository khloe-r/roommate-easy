import React from "react";
import { Layout } from "antd";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

const { Header } = Layout;

export const Navbar = () => {
  return (
    <Layout className="layout">
      <Header style={{ backgroundColor: "#fff", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Image alt="Roommate Easy Logo" src={"/logo.png"} width="200" height="30" />
        <SignOutButton />
      </Header>
    </Layout>
  );
};
