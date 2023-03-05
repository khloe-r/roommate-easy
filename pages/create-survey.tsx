import { Space, Spin } from "antd";
import Layout from "@/components/Layout";
import AuthorizedPage from "@/components/AuthorizedPage";
import { useUser } from "reactfire";
import { CreateSurveyForm } from "@/components/CreateSurveyForm";

const CreateSurvey = () => {
  const { data: user } = useUser();

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        {user?.uid ? (
          <CreateSurveyForm userId={user.uid} />
        ) : (
          <Space className="justify-center h-full">
            <Spin size="large" />
          </Space>
        )}
      </Layout>
    </AuthorizedPage>
  );
};

export default CreateSurvey;
