import { useCallback } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Form, Input, Space, Radio, Switch } from "antd";
import Layout from "@/components/Layout";
import AuthorizedPage from "@/components/AuthorizedPage";

const CreateSurvey = () => {
  const router = useRouter();
  const propertyInfo = ["Address", "Price", "Timeframe"];
  const preferenceInfo = [
    { title: "Gender", opts: ["Female", "Male", "Other"] },
    { title: "Pets", opts: ["YES, I have pets", "NO, I don't have pets and don't want pets in the unit", "NO, I don't have pets but are okay with pets in the unit"] },
    { title: "Sleeping Habits", opts: ["I usually sleep before 10 pm", "I usually sleep between 10 pm and 2 am", "I usually sleep after 2 am"] },
  ];

  return (
    <AuthorizedPage whenSignedOut="/auth/sign-in">
      <Layout>
        <div style={{ margin: "0px 50px 0px 50px" }}>
          <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
            CREATE YOUR SURVEY
          </Typography.Title>
          <Typography.Title className="Hero" style={{ fontWeight: 600, color: "#AFAFAF", fontSize: "large" }}>
            Property Info
          </Typography.Title>
          <Form name="basic" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={() => {}} autoComplete="off">
            {propertyInfo.map((name, index) => (
              <Form.Item key={index} label={name} name={name.toLowerCase()} rules={[{ required: true, message: `Please input your ${name.toLowerCase()}!` }]}>
                <Input />
              </Form.Item>
            ))}
            <Space align="baseline">
              Looking for{" "}
              <Form.Item name="spots_available">
                <Input />
              </Form.Item>
              <Form.Item name="roommates">
                <Radio.Group>
                  <Radio.Button value={true}>Roommate(s)</Radio.Button>
                  <Radio.Button value={false}>Sublet(s)</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Space>
            <Typography.Title className="Hero" style={{ fontWeight: 600, color: "#AFAFAF", fontSize: "large" }}>
              Preferences
            </Typography.Title>
            <Space direction="vertical">
              {preferenceInfo.map((preference, index) => (
                <Space key={index} direction="vertical">
                  <Space align="baseline">
                    <Form.Item name={preference.title} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    {preference.title}
                  </Space>
                  <Form.Item name="radio-group">
                    <Radio.Group>
                      <Space direction="vertical">
                        {preference.opts.map((opt, index) => (
                          <Radio key={index} value={index}>
                            {opt}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Space>
              ))}
            </Space>
          </Form>
        </div>
      </Layout>
    </AuthorizedPage>
  );
};

export default CreateSurvey;
