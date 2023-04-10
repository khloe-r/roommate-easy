import React from "react";
import { Button, Layout, Space } from "antd";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import { useRouter } from "next/router";
import { useUser } from "reactfire";

const { Header } = Layout;

export const Navbar = () => {
  const router = useRouter();
  const { status: loadingUser, data: user } = useUser();
  return (
    <Layout className="layout">
      <Header style={{ backgroundColor: "#fff", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Image alt="Roommate Easy Logo" src={"/logo.png"} width="200" height="30" onClick={() => router.push("/dashboard")} />
        <Space>
          {user && <SignOutButton />}
          {user && <Button onClick={() => router.push("/account")}>Account Settings</Button>}
        </Space>
      </Header>
    </Layout>
  );
};
