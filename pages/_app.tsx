import { AppProps } from "next/app";
import { initializeApp } from "firebase/app";

import { initializeAuth, indexedDBLocalPersistence, inMemoryPersistence } from "firebase/auth";

import { FirebaseAppProvider, AuthProvider } from "reactfire";

import configuration from "../configuration";

function App(props: AppProps) {
  const { Component, pageProps } = props;

  const app = initializeApp(configuration.firebase);

  const persistence = typeof window === "undefined" ? indexedDBLocalPersistence : inMemoryPersistence;

  const auth = initializeAuth(app, { persistence });

  return (
    <FirebaseAppProvider firebaseApp={app}>
      <AuthProvider sdk={auth}>
        <Component {...pageProps} />
      </AuthProvider>
    </FirebaseAppProvider>
  );
}

export default App;
