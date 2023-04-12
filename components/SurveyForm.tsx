import { preferenceInfo, SchoolList } from "@/constants";
import { SurveyType } from "@/types/survey.types";
import { Row, Col, Typography, Result, Button, Card, Space, Form, Input, Select, Radio, Modal, Alert } from "antd";
import { addDoc, arrayUnion, collection, doc, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

const SurveyForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const firestore = useFirestore();
  const [survey, setSurvey] = useState<SurveyType>({} as SurveyType);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const surveyCollection = collection(firestore, "surveys");
  const surveyQuery = query(surveyCollection, where("__name__", "==", id));
  const { status: surveysLoading, data: surveys } = useFirestoreCollectionData(surveyQuery, { idField: "id" });

  useEffect(() => {
    if (surveys && surveys.length > 0) {
      setSurvey(surveys[0] as SurveyType);
    }
  }, [survey, surveys]);

  const onSubmit = useCallback(
    async (values: any) => {
      setLoading(true);
      const contact_info = {
        name: values.name,
        primary_contact_info: values.primary_contact_info,
        secondary_contact_info: values.secondary_contact_info || null,
      };
      const answers: any = {};
      preferenceInfo.map((question) => {
        const a = values[question.title] || null;
        if (question.title in values) {
          answers[question.title] = question.opts && a != null ? question.opts[a] : a;
        }
      });
      if ("Additional Questions" in survey.questions) {
        answers["Additional Questions"] = (survey.questions["Additional Questions"] as string).split(",").map((_: string, index: number) => {
          return values[`Additional-Questions-${index}`] || null;
        });
      }

      try {
        const docRef = await addDoc(collection(firestore, "responses"), {
          contact_info,
          answers,
          survey_id: id,
          timestamp: new Date(),
        });

        await updateDoc(doc(firestore, "surveys", id), {
          responses: arrayUnion(docRef.id),
        });
        setStatus(`Success:${docRef.id}`);
      } catch (error) {
        console.log(error);
        setStatus("Error");
      }
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [survey]
  );

  const handleFinish = () => {
    setStatus("");
    router.push("/");
  };

  const personalInfo: string[] = ["Name", "Primary Contact Info", "Secondary Contact Info"];

  return (
    <div className="h-full">
      <Modal
        title=""
        open={status.includes("Success")}
        onOk={handleFinish}
        onCancel={handleFinish}
        footer={[
          <>
            <Button type="text" onClick={handleFinish}>
              Back to Home
            </Button>
            <Button type="primary" onClick={handleFinish}>
              Learn More
            </Button>
          </>,
        ]}
      >
        <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
          WOOHOO!
        </Typography.Title>
        <Typography.Text>Thank you for filling out this RoommateEasy survey! Interested in making your own surveys?</Typography.Text>
      </Modal>
      {surveys?.length == 0 && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, this survey does not exist."
          extra={
            <Button type="primary" onClick={() => router.push("/")}>
              Back Home
            </Button>
          }
        />
      )}
      {surveys?.length == 1 && survey && survey.archived && (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, this survey has been closed."
          extra={
            <Button type="primary" onClick={() => router.push("/")}>
              Back Home
            </Button>
          }
        />
      )}
      {surveys?.length == 1 && survey && !survey.archived && (
        <Row justify="center" align="middle" className="h-full">
          <Col span={12}>
            <Typography.Title className="Hero text-center" style={{ fontWeight: 700 }}>
              WELCOME!
            </Typography.Title>
            <Typography.Title className="Hero" style={{ fontWeight: 600, fontSize: "large" }}>
              This ROOMMATE EASY survey is designed for the following property:
            </Typography.Title>
            <Card style={{ borderColor: "#1C6FFF", marginBottom: "10px" }}>
              <Typography.Title className="Hero" style={{ fontWeight: 600 }}>
                {survey?.place_info?.address}
              </Typography.Title>
              <Space direction="vertical" size="middle">
                <Typography.Text>
                  {survey?.place_info?.timeframe} | ${survey?.place_info?.price} / month
                </Typography.Text>
                <Typography.Text>
                  Looking for {survey?.place_info?.spots_available} {survey?.place_info?.roommates ? "Roommate" : "Sublet"}
                  {survey?.place_info?.spots_available != "1" && "s"}
                </Typography.Text>
                <Typography.Text>Date Created: {survey?.created_at?.toDate().toString()}</Typography.Text>
              </Space>
            </Card>
            <Typography.Title className="Hero" style={{ fontWeight: 600, fontSize: "large" }}>
              Please complete this survey and the owner may reach out if they think you’d be a good match and the property is still available!
            </Typography.Title>
            <Typography.Text className="Hero" style={{ fontWeight: 600, color: "#AFAFAF" }}>
              All responses will be visible to the survey owner.
            </Typography.Text>
            <Form name="basic" layout="vertical" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={onSubmit} autoComplete="off">
              {personalInfo.map((name, index) => (
                <Form.Item key={index} label={<label style={{ fontWeight: 600 }}>{name}</label>} name={name.toLowerCase().split(" ").join("_")} rules={[{ required: index != 2, message: `Please input your ${name.toLowerCase()}!` }]}>
                  <Input />
                </Form.Item>
              ))}
              {preferenceInfo.map((question, index) => {
                if (survey && survey.questions && question.title in survey.questions) {
                  return (
                    <>
                      {question.title == "Additional Questions" ? (
                        <>
                          <Typography.Title className="Hero" style={{ fontWeight: 600, fontSize: "large" }}>
                            Additional Questions
                          </Typography.Title>
                          {(survey.questions[question.title] as string).split(",").map((question: string, additionalIndex: number) => {
                            return (
                              <Form.Item key={additionalIndex} label={<label style={{ fontWeight: 600 }}>{question}</label>} name={`Additional-Questions-${additionalIndex}`}>
                                <Input />
                              </Form.Item>
                            );
                          })}
                        </>
                      ) : (
                        <Form.Item key={index} label={<label style={{ fontWeight: 600 }}>{question.formattedTitle || question.title}</label>} name={question.title}>
                          {question.opts ? (
                            <Radio.Group>
                              <Space direction="vertical">
                                {question.opts.map((opt, index) => (
                                  <Radio key={index} value={index}>
                                    {opt}
                                  </Radio>
                                ))}
                              </Space>
                            </Radio.Group>
                          ) : question.formType == "autocomplete" ? (
                            <Select
                              mode="tags"
                              options={SchoolList.map((school) => {
                                return { label: school, value: school };
                              })}
                            />
                          ) : question.title != "Additional Questions" ? (
                            <Input type={question.formType} />
                          ) : (
                            <></>
                          )}
                        </Form.Item>
                      )}
                    </>
                  );
                }
              })}
              {survey?.questions && "Additional Questions" in survey?.questions && (
                <>
                  <Typography.Title className="Hero" style={{ fontWeight: 600, fontSize: "large" }}>
                    Additional Questions
                  </Typography.Title>
                  {(survey.questions["Additional Questions"] as string).split(",").map((question: string, additionalIndex: number) => {
                    return (
                      <Form.Item key={additionalIndex} label={<label style={{ fontWeight: 600 }}>{question}</label>} name={`Additional-Questions-${additionalIndex}`}>
                        <Input />
                      </Form.Item>
                    );
                  })}
                </>
              )}
              <Form.Item wrapperCol={{ span: 16 }} className="justify-center">
                <Button type="primary" htmlType="submit" disabled={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
            {status.includes("Error") && <Alert message="Oh no! Form could not be submitted, please try again." type="error" />}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SurveyForm;
