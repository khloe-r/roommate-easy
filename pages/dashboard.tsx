import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import React from "react";

const Dashboard = () => {
  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <>
          <h1>Welcome</h1>
        </>
      </Layout>
    </AuthorizedPage>
  );
};

export default Dashboard;
