import { Col, Row, Typography } from "antd";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="AuthContainer h-full">
        <Layout>
          <Row justify="center" align="middle" className="h-full">
            <Col span={6}>
              <Typography.Title className="Hero text-center" style={{ fontWeight: 700, fontSize: 100, marginBottom: -40 }}>
                404
              </Typography.Title>
              <Typography.Title className="text-center">PAGE NOT FOUND</Typography.Title>
              <Typography className="text-center">
                <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/")}>
                  Back to Home
                </span>
              </Typography>
            </Col>
          </Row>
        </Layout>
      </div>
    </>
  );
}
