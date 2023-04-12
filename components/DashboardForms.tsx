import React, { useCallback } from "react";
import { useFirestoreCollectionData, useUser } from "reactfire";
import { collection, doc, DocumentData, DocumentReference, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useFirestoreDocData, useFirestore } from "reactfire";
import { Typography, Form, Button, Input, Card, Space, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const Surveys = ({ data }: { data: any }) => {
  const firestore = useFirestore();
  const router = useRouter();

  const surveyCollection = collection(firestore, "surveys");
  const surveyQuery = query(surveyCollection, where("__name__", "in", !data.surveys || data.surveys.length === 0 ? ["default"] : data.surveys));
  const { status: surveysLoading, data: surveys } = useFirestoreCollectionData(surveyQuery, { idField: "id" });

  const handleLongAddress = (str: string) => {
    return str.length > 20 ? str.substring(0, 17) + "..." : str;
  };

  const handleArchiveSurvey = (id: string, status?: boolean) => {
    updateDoc(doc(firestore, "surveys", id), {
      archived: !status,
    });
  };

  return (
    <>
      <Space style={{ paddingBottom: 50 }} size={[16, 16]} wrap>
        {surveys &&
          surveys.map((survey: any, index: number) => {
            return (
              <Card key={index} style={{ borderColor: "#1C6FFF", maxWidth: 400, minHeight: 300 }}>
                <Typography.Title className="Hero" style={{ fontWeight: 600 }}>
                  {handleLongAddress(survey?.place_info?.address)}
                </Typography.Title>
                <Space direction="vertical" size="middle">
                  <Typography.Text>
                    {survey?.place_info?.timeframe} | ${survey?.place_info?.price} / month
                  </Typography.Text>
                  <Typography.Text>
                    Looking for {survey?.place_info?.spots_available} {survey?.place_info?.roommates ? "Roommate" : "Sublet"}
                    {survey?.place_info?.spots_available > 1 && "s"}
                  </Typography.Text>
                  <Typography.Text>Date Created: {survey?.created_at?.toDate().toString().substring(0, 15)}</Typography.Text>
                  <Space direction="horizontal" wrap>
                    <Button type="primary" onClick={() => router.push(`/survey/${survey.id}`)}>
                      View Survey
                    </Button>
                    <Button type="default" onClick={() => router.push(`/edit-survey/${survey.id}`)}>
                      Edit Survey
                    </Button>
                    <Button type="default" onClick={() => router.push(`/results/${survey.id}`)}>
                      View Results
                    </Button>
                    <Button type="default" onClick={() => handleArchiveSurvey(survey.id, survey.archived)}>
                      {survey.archived ? "Unarchive Survey" : "Archive Survey"}
                    </Button>
                  </Space>
                </Space>
              </Card>
            );
          })}
        <Card style={{ borderColor: "#1C6FFF", backgroundColor: "#1C6FFF", maxWidth: 300, minHeight: 300 }} onClick={() => router.push("/create-survey")}>
          <Typography.Title className="Hero" style={{ fontWeight: 600, color: "white" }}>
            ADD NEW SURVEY
          </Typography.Title>
          <Space className="justify-center">
            <PlusOutlined style={{ color: "white", fontSize: 60 }} />
          </Space>
        </Card>
      </Space>
    </>
  );
};

export const DashboardForms = ({ userRef }: { userRef: DocumentReference<DocumentData> }) => {
  const { data } = useFirestoreDocData(userRef);

  const onSubmit = useCallback(
    async (values: any) => {
      const first_name = values.first_name as string;
      const last_name = values.last_name as string;

      return setDoc(userRef, {
        first_name: first_name,
        last_name: last_name,
        surveys: [],
      });
    },
    [userRef]
  );

  return (
    <div style={{ margin: "0px 50px 0px 50px" }}>
      {data?.first_name && (
        <>
          <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
            YOUR SURVEYS
          </Typography.Title>
          {data && <Surveys data={data} />}
        </>
      )}
      {!data?.first_name && (
        <>
          <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
            WELCOME!
          </Typography.Title>
          <Form name="basic" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={onSubmit} autoComplete="off">
            <Form.Item label="First Name" name="first_name" rules={[{ required: true, message: "Please input your first name!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Last Name" name="last_name" rules={[{ required: false, message: "Please input your last name!" }]}>
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16 }} className="justify-center">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};
