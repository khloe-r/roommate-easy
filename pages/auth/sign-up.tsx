import { useCallback } from "react";
import { useRouter } from "next/router";
import { Row, Col, Typography } from "antd";

import SignUpForm from "@/components/SignUpForm";

const SignUp = () => {
  const router = useRouter();

  const onSignup = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="AuthContainer h-full">
      <Row justify="center" align="middle" className="h-full">
        <Col span={6}>
          <Typography.Title className="Hero text-center" style={{ fontWeight: 700 }}>
            SIGN UP
          </Typography.Title>

          <SignUpForm onSignup={onSignup} />
          <Typography className="text-center">
            Already have an account?{" "}
            <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/auth/sign-in")}>
              Log In
            </span>
          </Typography>
        </Col>
      </Row>
    </div>
  );
};

export default SignUp;
