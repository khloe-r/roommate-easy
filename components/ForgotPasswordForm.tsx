import { useCallback, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "../lib/hooks/useSignInWithEmailAndPassword";
import { Alert, Button, Form, Input } from "antd";
import { useForgotPassword } from "@/lib/hooks/useForgotPassword";

interface ForgotPasswordFormProps {
  onReset: () => void;
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const [resetPassword, state] = useForgotPassword();
  const loading = state.loading;
  const error = state.error;

  useEffect(() => {
    if (state.success) {
      props.onReset();
    }
  }, [props, state.success]);

  const onSubmit = useCallback(
    async (values: any) => {
      if (loading) {
        return;
      }

      const email = values.email as string;

      return resetPassword(email);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, props, resetPassword]
  );

  return (
    <>
      {state.error && <Alert style={{ marginBottom: 8 }} message="Error" description="Error sending reset password email" type="error" showIcon />}
      <Form name="basic" layout="vertical" labelCol={{ span: 8 }} wrapperCol={{ span: 24 }} initialValues={{ remember: true }} onFinish={onSubmit} autoComplete="off">
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 16 }} className="justify-center">
          <Button type="primary" htmlType="submit">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
