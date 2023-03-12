import { AppProps } from "next/app";
import { initializeApp } from "firebase/app";

import { initializeAuth, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";

import { FirebaseAppProvider, AuthProvider, FirestoreProvider } from "reactfire";

import configuration from "../configuration";
import { ConfigProvider } from "antd";

import "antd/dist/reset.css";
import "../styles/globals.css";
import { initializeFirestore } from "firebase/firestore";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  const app = initializeApp(configuration.firebase);

  const persistence = browserSessionPersistence;

  const auth = initializeAuth(app, { persistence });
  const firestore = initializeFirestore(app, {});

  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestore}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1C6FFF",
                fontFamily: "Raleway",
              },
              components: {
                Input: {
                  colorBorder: "#1C6FFF",
                  lineWidth: 2,
                },
                Select: {
                  colorBorder: "#1C6FFF",
                  lineWidth: 2,
                },
                Card: {
                  lineWidth: 5,
                },
              },
            }}
          >
            <Component {...pageProps} />
            <style jsx global>{`
              #__next {
                height: 100%;
              }
            `}</style>
          </ConfigProvider>
        </FirestoreProvider>
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
