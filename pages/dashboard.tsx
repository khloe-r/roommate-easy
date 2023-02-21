import AuthorizedPage from "@/components/AuthorizedPage";
import Layout from "@/components/Layout";
import React, { useCallback, useEffect } from "react";
import { useAuth, useFirestoreCollectionData, useUser } from "reactfire";
import { collection, doc, getFirestore, query, setDoc } from "firebase/firestore";
import { FirebaseAppProvider, FirestoreProvider, useFirestoreDocData, useFirestore, useFirebaseApp } from "reactfire";
import { User } from "firebase/auth";
import { Typography, Form, Button, Input, Card, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const Dashboard = () => {
  const { status: loadingUser, data: user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userRef = doc(firestore, "users", user?.uid || "default");
  const { status, data } = useFirestoreDocData(userRef);

  const surveyCollection = collection(firestore, "surveys");
  const surveyQuery = query(surveyCollection);
  const { status: surveysLoading, data: surveys } = useFirestoreCollectionData(surveyQuery, { idField: "id" });

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
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <div style={{ margin: "0px 50px 0px 50px" }}>
          {data?.first_name && (
            <>
              <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
                YOUR SURVEYS
              </Typography.Title>
              <Space size={[16, 16]} wrap>
                {data &&
                  data.surveys.map((surveyId: any, index: number) => {
                    const survey = surveys.find((s) => s.id == surveyId);
                    console.log(survey);
                    return (
                      <Card key={index} style={{ borderColor: "#1C6FFF", maxWidth: 400, minHeight: 300 }}>
                        <Typography.Title className="Hero" style={{ fontWeight: 600 }}>
                          {survey?.place_info?.address}
                        </Typography.Title>
                        <Space direction="vertical" size="middle">
                          <Typography.Text>{survey?.place_info?.timeframe}</Typography.Text>
                          <Typography.Text>
                            Looking for {survey?.place_info?.spots_available} {survey?.place_info?.roommates ? "Roommate" : "Sublet"}
                            {survey?.place_info?.spots_available > 1 && "s"}
                          </Typography.Text>
                          <Typography.Text>Date Created: {(survey?.created_at).toDate().toString()}</Typography.Text>
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
      </Layout>
    </AuthorizedPage>
  );
};

export default Dashboard;
