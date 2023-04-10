import { Space, Spin } from "antd";
import Layout from "@/components/Layout";
import AuthorizedPage from "@/components/AuthorizedPage";
import { useUser } from "reactfire";
import { EditSurveyForm } from "@/components/EditSurveyForm";
import { useRouter } from "next/router";

const CreateSurvey = () => {
  const router = useRouter();

  const { data: user } = useUser();
  const { id } = router.query;

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        {user?.uid && id ? (
          <EditSurveyForm userId={user.uid} surveyId={id as string} />
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
