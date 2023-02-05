import AuthorizedPage from "@/components/AuthorizedPage";
import SignOutButton from "@/components/SignOutButton";
import React from "react";

const Dashboard = () => {
  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <h1>Welcome</h1>
      <SignOutButton />
    </AuthorizedPage>
  );
};

export default Dashboard;
