import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Form, Input, Space, Radio, Switch, Button, Select, Alert, Modal, Checkbox } from "antd";
import { useFirestore } from "reactfire";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { preferenceInfo, SchoolList } from "@/constants";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export const CreateSurveyForm = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const propertyInfo: string[] = ["Address", "Price", "Timeframe"];
  const firestore = useFirestore();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const onSubmit = useCallback(async (values: any) => {
    setLoading(true);
    console.log(values);
    const place_info = {
      address: values.address,
      roommates: values.roommates,
      price: values.price,
      spots_available: values.spots_available,
      timeframe: values.timeframe,
    };
    const questions: any = {};
    preferenceInfo.map((question) => {
      const q = values[question.title];
      const a = values[`${question.title}-option`] || null;
      if (q) {
        questions[question.title] = question.opts && a != null ? question.opts[a] : a;
      }
    });

    if (values["Additional Questions"]) {
      questions["Additional Questions"] = values[`Additional Questions-option`].join(",") || null;
    }

    try {
      const docRef = await addDoc(collection(firestore, "surveys"), {
        place_info,
        questions,
        responses: [],
        user_id: userId,
        created_at: new Date(),
        public: values.public || false,
      });

      await updateDoc(doc(firestore, "users", userId), {
        surveys: arrayUnion(docRef.id),
      });
      setStatus(`Success:${docRef.id}`);
    } catch (error) {
      console.log(error);
      setStatus("Error");
    }
    setLoading(false);
  }, []);

  return (
    <div style={{ margin: "0px 50px 0px 50px" }}>
      <Modal title="" open={status.includes("Success")} onOk={() => router.push("/dashboard")} onCancel={() => router.push("/dashboard")}>
        <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
          WOOHOO!
        </Typography.Title>
        <Typography.Text>Your survey has been created! Share it with potential candidates using this link:</Typography.Text>
        <Typography.Title onClick={() => router.push(`/survey/${status.split(":")[1]}`)} className="Hero" style={{ cursor: "pointer", fontWeight: 500, marginTop: 0, fontSize: 30, color: "#1D6FFF" }}>
          roommate-easy.web.app/survey/{status.split(":")[1]}
        </Typography.Title>
      </Modal>
      <Typography.Title className="Hero" style={{ fontWeight: 700 }}>
        CREATE YOUR SURVEY
      </Typography.Title>
      <Typography.Title className="Hero" style={{ fontWeight: 600, color: "#AFAFAF", fontSize: "large" }}>
        Property Info
      </Typography.Title>
      <Form name="basic" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={onSubmit} autoComplete="off">
        {propertyInfo.map((name, index) => (
          <Form.Item key={index} label={`${name === "Price" ? "Price per month" : name}`} name={name.toLowerCase()} rules={[{ required: true, message: `Please input your ${name.toLowerCase()}!` }]}>
            <Input />
          </Form.Item>
        ))}
        <Space align="baseline">
          Looking for{" "}
          <Form.Item name="spots_available" rules={[{ required: true, message: `Please input the number of spaces available` }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="roommates" rules={[{ required: true, message: `Please select either roommates or sublets` }]}>
            <Radio.Group>
              <Radio.Button value={true}>Roommate(s)</Radio.Button>
              <Radio.Button value={false}>Sublet(s)</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Space>
        <Typography.Title className="Hero" style={{ fontWeight: 600, color: "#AFAFAF", fontSize: "large" }}>
          Preferences
        </Typography.Title>
        <Typography.Text>
          The following are commonly asked questions you may be interested in looking for in potential roommates. If you would like the question asked in your survey activate the switch beside the section title. Then pick your desired response from the list (or leave the response blank to indicate no
          preference). All questions will be optional in the survey to recipients for anyone not comfortable answering.
          <br />
          <br />
          Note: All preferences indicated below will not be shown to potential candidates taking the survey and only used to help you filter responses later on
        </Typography.Text>
        <br />
        <Space direction="vertical" style={{ marginBottom: "100px", marginTop: "20px" }}>
          {preferenceInfo.map((preference, index) => (
            <Space key={index} direction="vertical">
              <Space align="baseline">
                <Form.Item name={preference.title} valuePropName="checked" style={{ marginBottom: "10px" }}>
                  <Switch />
                </Form.Item>
                {preference.title}
              </Space>
              {preference.description && <Typography.Text>{preference.description}</Typography.Text>}
              <Form.Item name={`${preference.title}-option`}>
                {preference.opts ? (
                  <>
                    <Radio.Group>
                      <Space direction="vertical">
                        {preference.opts.map((opt, index) => (
                          <Radio key={index} value={index}>
                            {opt}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </>
                ) : preference.formType != "autocomplete" ? (
                  <Input type={preference.formType} />
                ) : (
                  <Select
                    mode="tags"
                    options={SchoolList.map((school) => {
                      return { label: school, value: school };
                    })}
                  />
                )}
              </Form.Item>
            </Space>
          ))}
          <Space align="baseline">
            <Form.Item name="Additional Questions" valuePropName="checked" style={{ marginBottom: "10px" }}>
              <Switch />
            </Form.Item>
            Additional Questions
          </Space>
          <Form.List name="Additional Questions-option">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item {...formItemLayout} required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Please input additional question or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Additional question?" style={{ width: "60%", marginRight: 10 }} />
                    </Form.Item>
                    {fields.length > 0 ? <MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} /> : null}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} style={{ width: "60%" }} icon={<PlusOutlined />}>
                    Add question
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Typography.Title className="Hero" style={{ fontWeight: 600, color: "#AFAFAF", fontSize: "large" }}>
            Visibility
          </Typography.Title>
          <Typography.Text>By marking this survey as public it may be shown with other public surveys on the Roommate Easy website. Otherwise, it will only be reachable through your unique survey link created after submission.</Typography.Text>
          <Space align="baseline">
            <Form.Item name="public" valuePropName="checked" style={{ marginBottom: "10px" }}>
              <Switch />
            </Form.Item>{" "}
            Yes, my survey can be shown publically on the Roommate Easy website
          </Space>
          <Space align="baseline">
            <Form.Item
              name="terms_and_conditions"
              valuePropName="checked"
              style={{ marginBottom: "10px" }}
              rules={[
                {
                  validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error("You must agree to the terms and conditions"))),
                },
              ]}
            >
              <Checkbox />
            </Form.Item>
            I agree to the terms and conditions
          </Space>

          <Button type="primary" htmlType="submit" disabled={loading}>
            Submit
          </Button>
          {status.includes("Error") && <Alert message="Oh no! Form could not be submitted, please try again." type="error" />}
        </Space>
      </Form>
    </div>
  );
};
