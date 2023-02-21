import { useCallback, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "../lib/hooks/useSignInWithEmailAndPassword";
import { Alert, Button, Form, Input } from "antd";

interface SignInFormProps {
  onSignIn: () => void;
}

const SignInForm = (props: SignInFormProps) => {
  const [signIn, state] = useSignInWithEmailAndPassword();
  const loading = state.loading;
  const error = state.error;

  useEffect(() => {
    if (state.success) {
      props.onSignIn();
    }
  }, [props, state.success]);

  const onSubmit = useCallback(
    async (values: any) => {
      if (loading) {
        return;
      }

      const email = values.email as string;
      const password = values.password as string;

      return signIn(email, password);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, props, signIn]
  );

  return (
    <>
      {state.error && <Alert style={{ marginBottom: 8 }} message="Error" description="Invalid Username or Password" type="error" showIcon />}
      <Form name="basic" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={onSubmit} autoComplete="off">
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }} className="justify-center">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignInForm;
