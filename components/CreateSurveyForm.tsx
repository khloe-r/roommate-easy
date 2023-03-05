import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Form, Input, Space, Radio, Switch, Button, Select, Alert, Modal } from "antd";
import { useFirestore } from "reactfire";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { preferenceInfo, SchoolList } from "@/constants";

export const CreateSurveyForm = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const propertyInfo: string[] = ["Address", "Price", "Timeframe"];
  const firestore = useFirestore();

  const onSubmit = useCallback(async (values: any) => {
    setLoading(true);
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
      if (q != undefined) {
        questions[question.title] = question.opts && a != null ? question.opts[a] : a;
      }
    });

    try {
      const docRef = await addDoc(collection(firestore, "surveys"), {
        place_info,
        questions,
        responses: [],
        user_id: userId,
        created_at: new Date(),
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
        <Typography.Title className="Hero" style={{ fontWeight: 500, marginTop: 0, fontSize: 30 }}>
          <Link href={`localhost:3000/survey/${status.split(":")[1]}`} target="_blank">
            roommate-easy.web.app/survey/{status.split(":")[1]}
          </Link>
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
          <Form.Item key={index} label={name} name={name.toLowerCase()} rules={[{ required: true, message: `Please input your ${name.toLowerCase()}!` }]}>
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
                  <Radio.Group>
                    <Space direction="vertical">
                      {preference.opts.map((opt, index) => (
                        <Radio key={index} value={index}>
                          {opt}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
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
          <Button type="primary" htmlType="submit" disabled={loading}>
            Submit
          </Button>
          {status.includes("Error") && <Alert message="Oh no! Form could not be submitted, please try again." type="error" />}
        </Space>
      </Form>
    </div>
  );
};
