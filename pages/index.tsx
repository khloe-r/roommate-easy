import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { Col, Row, Typography } from "antd";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className="AuthContainer h-full">
        <Layout>
          <Row justify="center" align="middle" className="h-full">
            <Col span={6}>
              <Typography.Title className="Hero text-center" style={{ fontWeight: 700 }}>
                ROOMMATE EASY
              </Typography.Title>
              <Typography className="text-center">
                <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/auth/sign-in")}>
                  Log In
                </span>
              </Typography>
              <Typography className="text-center">
                <span style={{ fontWeight: 700, cursor: "pointer" }} onClick={() => router.push("/auth/sign-up")}>
                  Sign Up
                </span>
              </Typography>
            </Col>
          </Row>
        </Layout>
      </div>
    </>
  );
}
