import Layout from "@/components/Layout";
import SurveyForm from "@/components/SurveyForm";
import { Row, Col, Typography } from "antd";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const Survey = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout>
      <div className="h-full">{id && <SurveyForm id={id as string} />}</div>
    </Layout>
  );
};

export default Survey;
