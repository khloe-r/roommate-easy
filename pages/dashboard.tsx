import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import React from "react";
import { useUser } from "reactfire";
import { doc } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { Space, Spin } from "antd";
import { DashboardForms } from "@/components/DashboardForms";

const Dashboard = () => {
  const { status: loadingUser, data: user } = useUser();
  const firestore = useFirestore();

  const userRef = doc(firestore, "users", user?.uid || "default");

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        {user?.uid ? (
          <DashboardForms userRef={userRef} />
        ) : (
          <Space className="justify-center h-full">
            <Spin size="large" />
          </Space>
        )}
      </Layout>
    </AuthorizedPage>
  );
};

export default Dashboard;
