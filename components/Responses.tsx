import { FormattedAnswer, ResponseType } from "@/types/response.types";
import { Card, Space, Typography } from "antd";
import { collection, DocumentData, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const Responses = ({ responses, answerKey }: { responses: string[]; answerKey: { [key: string]: string | string[] } }) => {
  const router = useRouter();
  const firestore = useFirestore();
  const [formattedData, setFormattedData] = useState<ResponseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const surveyCollection = collection(firestore, "responses");
  const surveyQuery = query(surveyCollection, where("__name__", "in", responses));
  const { status: surveysLoading, data } = useFirestoreCollectionData(surveyQuery, { idField: "id" });

  const getColour = (question: string, response: DocumentData) => {
    if (question === "Additional Questions") {
      return "#262626";
    } else if (answerKey[question] && answerKey[question] == response.answers[question]) {
      return "green";
    } else if (Array.isArray(answerKey[question]) && Array.isArray(response.answers[question]) && (answerKey[question] as string[]).filter((value: any) => response.answers[question].includes(value)).length > 0) {
      return "green";
    } else if (answerKey[question]) {
      return "red";
    } else {
      return "#262626";
    }
  };

  useEffect(() => {
    const newData = data?.map((response) => {
      const score = { red: 0, green: 0, "#262626": 0 };
      let additionalQuestionIndex = -1;
      const answers: FormattedAnswer[] = Object.keys(response.answers).map((question, index) => {
        const questionColour = getColour(question, response);
        score[questionColour] += 1;
        if (question === "Additional Questions") {
          additionalQuestionIndex = index;
        }
        return { question: question, answer: response.answers[question], colour: questionColour };
      });
      if (additionalQuestionIndex != -1) {
        answers.push(answers.splice(additionalQuestionIndex, 1)[0]);
      }
      return {
        ...response,
        answers: answers,
        score: score.red + score.green === 0 ? 1 : score.green / (score.red + score.green),
      };
    });
    setFormattedData(newData as ResponseType[]);
  }, [data]);

  return (
    <div style={{ paddingBottom: 100 }}>
      {formattedData && (
        <Typography.Title style={{ marginTop: "20px", fontWeight: 700 }}>
          {formattedData.length} Result{formattedData.length != 1 && "s"}
        </Typography.Title>
      )}
      {formattedData &&
        formattedData.map((response: any, index: number) => (
          <Card key={index} style={{ borderColor: "#1C6FFF", marginBottom: "10px" }}>
            <Space direction="horizontal" align="start">
              <Space direction="vertical" align="center">
                <Typography.Title style={{ marginBottom: "-5px" }}>{(response.score * 100).toFixed()}%</Typography.Title>
                <Typography.Text>Match</Typography.Text>
              </Space>
              <Space direction="vertical" style={{ marginLeft: "10px" }}>
                <>
                  <Typography.Title>{response.contact_info.name}</Typography.Title>
                  <Typography.Text>Completed on {new Date(response.timestamp?.seconds * 1000).toLocaleDateString("en-US")}</Typography.Text>
                  <Typography.Text>
                    Contact Info: {response.contact_info.primary_contact_info}
                    {response.contact_info.secondary_contact_info ? " or " + response.contact_info.secondary_contact_info : ""}
                  </Typography.Text>
                  {response.answers.map((answer: FormattedAnswer, index: number) => (
                    <Space key={index} direction="vertical">
                      <Typography.Text style={{ fontWeight: 600, fontSize: "large", color: answer.colour }}>{answer.question}</Typography.Text>
                      {answer.question != "Additional Questions" ? (
                        <Typography.Text>{answer.answer || "No response"}</Typography.Text>
                      ) : (
                        <>
                          {answerKey[answer.question] &&
                            (answerKey[answer.question] as string).split(",").map((addQ, index) => (
                              <>
                                <Typography.Text>
                                  {addQ} {answer.answer[index]}
                                </Typography.Text>
                              </>
                            ))}
                        </>
                      )}
                    </Space>
                  ))}
                </>
              </Space>
            </Space>
          </Card>
        ))}
    </div>
  );
};

export default Responses;
