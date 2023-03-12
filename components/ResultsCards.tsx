import { Button, Card, Result, Space, Typography } from "antd";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import Responses from "./Responses";

const ResultsCards = ({ id }: { id: string }) => {
  const { status: loadingUser, data: user } = useUser();

  const router = useRouter();
  const firestore = useFirestore();
  const [survey, setSurvey] = useState<any>(null);
  const [surveyResponses, setSurveyResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(true);

  const surveyCollection = collection(firestore, "surveys");
  const surveyQuery = query(surveyCollection, where("__name__", "==", id));
  const { status: surveysLoading, data: surveys } = useFirestoreCollectionData(surveyQuery, { idField: "id" });

  useEffect(() => {
    if (surveys && surveys.length > 0) {
      if (user?.uid && surveys[0].user_id == user?.uid) {
        setSurvey(surveys[0]);
        setSurveyResponses(surveys[0].responses);
      } else {
        setAuthorized(false);
        setSurvey(null);
      }
    }
  }, [survey, surveys, user]);

  return (
    <div style={{ margin: "0px 50px 50px 50px" }}>
      <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
        VIEW YOUR RESULTS
      </Typography.Title>
      {surveys?.length == 0 && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, this survey does not exist."
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      )}
      {!authorized && (
        <Result
          title="Error"
          subTitle="You are not authorized to view these survey results"
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      )}
      {surveys?.length == 1 && survey && (
        <Card style={{ borderColor: "#1C6FFF", marginBottom: "10px" }}>
          <Typography.Title className="Hero" style={{ fontWeight: 600 }}>
            {survey?.place_info?.address}
          </Typography.Title>
          <Space direction="vertical" size="middle">
            <Typography.Text>{survey?.place_info?.timeframe}</Typography.Text>
            <Typography.Text>
              Looking for {survey?.place_info?.spots_available} {survey?.place_info?.roommates ? "Roommate" : "Sublet"}
              {survey?.place_info?.spots_available > 1 && "s"}
            </Typography.Text>
            <Typography.Text>Date Created: {survey?.created_at?.toDate().toString()}</Typography.Text>
          </Space>
        </Card>
      )}
      {survey && survey.responses.length == 0 && (
        <Result
          title="No responses yet!"
          extra={
            <Button type="primary" onClick={() => router.push("/dashboard")}>
              Back Home
            </Button>
          }
        />
      )}
      {survey && surveyResponses.length > 0 && <Responses responses={surveyResponses} answerKey={survey.questions} />}
    </div>
  );
};

export default ResultsCards;
