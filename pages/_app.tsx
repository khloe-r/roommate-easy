import { AppProps } from "next/app";
import { initializeApp } from "firebase/app";

import { initializeAuth, indexedDBLocalPersistence, inMemoryPersistence } from "firebase/auth";

import { FirebaseAppProvider, AuthProvider } from "reactfire";

import configuration from "../configuration";
import { ConfigProvider } from "antd";

import "antd/dist/reset.css";
import "../styles/globals.css";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  const app = initializeApp(configuration.firebase);

  const persistence = typeof window === "undefined" ? indexedDBLocalPersistence : inMemoryPersistence;

  const auth = initializeAuth(app, { persistence });

  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
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
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
