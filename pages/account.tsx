import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import React from "react";
import { useUser } from "reactfire";
import { doc } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { Space, Spin, Typography } from "antd";
import { DashboardForms } from "@/components/DashboardForms";

const Dashboard = () => {
  const { status: loadingUser, data: user } = useUser();
  const firestore = useFirestore();

  const userRef = doc(firestore, "users", user?.uid || "default");

  console.log(user);

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <div style={{ margin: "0px 50px 0px 50px" }}>
          <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
            YOUR ACCOUNT
          </Typography.Title>
        </div>
      </Layout>
    </AuthorizedPage>
  );
};

export default Dashboard;
