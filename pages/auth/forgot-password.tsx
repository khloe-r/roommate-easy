import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography, Alert } from "antd";

import SignInForm from "@/components/SignInForm";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

const ForgotPassword = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<boolean>(false);

  const onReset = useCallback(() => {
    setSuccess(true);
  }, [router]);

  return (
    <div className="AuthContainer h-full">
      <Row justify="center" align="middle" className="h-full">
        <Col span={6}>
          <Typography.Title className="Hero text-center" style={{ fontWeight: 700 }}>
            FORGOT PASSWORD
          </Typography.Title>
          {success && <Alert style={{ marginBottom: 8 }} message="Success" description="Reset password email has been sent!" type="success" showIcon />}

          <ForgotPasswordForm onReset={onReset} />
          <Typography className="text-center">
            Don&apos;t need to reset anymore?{" "}
            <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/auth/sign-in")}>
              Sign In
            </span>
          </Typography>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
