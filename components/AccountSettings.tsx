import { useCallback, useEffect, useState } from "react";
import { useSignUpWithEmailAndPassword } from "../lib/hooks/useSignUpWithEmailAndPassword";
import { Button, Form, Input, Alert, Typography, Space, Modal } from "antd";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { EditFilled } from "@ant-design/icons";
import { useRouter } from "next/router";
import { AuthCredential, EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile, User } from "firebase/auth";

interface AccountSettingsProps {
  userId: string;
  email: string;
}

const AccountSettings = (props: AccountSettingsProps) => {
  const firestore = useFirestore();
  const userRef = doc(firestore, "users", props.userId);
  const { data } = useFirestoreDocData(userRef);

  return <>{data && <MyAccountData data={data} email={props.email} userId={props.userId} />}</>;
};

const MyAccountData = ({ data, email, userId }: { data: any; email: string; userId: string }) => {
  const router = useRouter();
  const auth = getAuth();
  const firestore = useFirestore();
  const userRef = doc(firestore, "users", userId);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const onSubmit = useCallback(async (values: any) => {
    console.log(values);
    if (values.password != values.password_confirm) {
      setStatus("Error: Passwords don't match");
    } else {
      const credential = EmailAuthProvider.credential(email, values.old_password);
      reauthenticateWithCredential(auth.currentUser as User, credential)
        .then(() => {
          updatePassword(auth.currentUser as User, values.password);
          setStatus("Success: Updated Password");
        })
        .catch((error) => {
          setStatus("Error: Incorrect password entered");
        });
    }

    if (values.email != email) {
      updateEmail(auth.currentUser as User, values.email)
        .then(() => {
          setStatus("Success: Updated Email");
        })
        .catch((error) => {
          setStatus("Error: Please login again to confirm your identity");
        });
    }

    if (values.name != `${data.first_name} ${data.last_name}`) {
      return setDoc(userRef, {
        first_name: values.name.split(" ")[0],
        last_name: values.name.split(" ").slice(1),
      });
    }
  }, []);

  const handleFinish = () => {
    setIsEdit(false);
    router.push("dashboard");
  };

  return (
    <>
      <Space direction="vertical">
        <Modal title="Edit Profile" open={isEdit} onOk={handleFinish} onCancel={handleFinish} footer={[<></>]}>
          <Form name="basic" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ name: `${data.first_name} ${data.last_name}`, email: email }} onFinish={onSubmit} autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Old Password" name="old_password">
              <Input.Password />
            </Form.Item>

            <Form.Item label="New Password" name="password">
              <Input.Password />
            </Form.Item>

            <Form.Item label="New Password Confirmation" name="password_confirm">
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 16 }} className="justify-center">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
          {status.includes("Error") && <Alert message={status} type="error" />}
          {status.includes("Success") && <Alert message={status} type="success" />}
        </Modal>
        <Typography.Text className="Hero" style={{ fontWeight: 600, color: "#AFAFAF" }}>
          Name
        </Typography.Text>
        <Typography.Text className="Hero">
          {data.first_name} {data.last_name}
        </Typography.Text>
        <Typography.Text className="Hero" style={{ fontWeight: 600, color: "#AFAFAF" }}>
          Email
        </Typography.Text>
        <Typography.Text className="Hero">{email}</Typography.Text>
        <Typography.Text className="Hero" style={{ fontWeight: 600, color: "#AFAFAF" }}>
          Password
        </Typography.Text>
        <Typography.Text className="Hero">********</Typography.Text>
        <Button onClick={() => setIsEdit(true)}>Edit Profile Details</Button>
      </Space>
    </>
  );
};

export default AccountSettings;
