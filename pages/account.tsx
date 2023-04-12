import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import React from "react";
import { useUser } from "reactfire";
import { Typography } from "antd";
import AccountSettings from "@/components/AccountSettings";

const Dashboard = () => {
  const { status: loadingUser, data: user } = useUser();

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <div style={{ margin: "0px 50px 0px 50px" }}>
          <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
            YOUR ACCOUNT
          </Typography.Title>
          {user && <AccountSettings userId={user?.uid} email={user?.email || ""} />}
        </div>
      </Layout>
    </AuthorizedPage>
  );
};

export default Dashboard;
