import { useCallback } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography } from "antd";

import SignInForm from "@/components/SignInForm";

const SignIn = () => {
  const router = useRouter();

  const onSignin = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="AuthContainer h-full">
      <Row justify="center" align="middle" className="h-full">
        <Col span={6}>
          <Typography.Title className="Hero text-center" style={{ fontWeight: 700 }}>
            LOG IN
          </Typography.Title>

          <SignInForm onSignIn={onSignin} />
          <Typography className="text-center">
            Don&apos;t have an account?{" "}
            <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/auth/sign-up")}>
              Sign Up
            </span>
          </Typography>
        </Col>
      </Row>
    </div>
  );
};

export default SignIn;
