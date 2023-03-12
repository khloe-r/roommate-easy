import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import ResultsCards from "@/components/ResultsCards";
import SurveyForm from "@/components/SurveyForm";
import { Row, Col, Typography } from "antd";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const Survey = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <div className="h-full">{id && <ResultsCards id={id as string} />}</div>
      </Layout>
    </AuthorizedPage>
  );
};

export default Survey;
