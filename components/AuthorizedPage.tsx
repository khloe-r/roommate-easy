import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useAuth, useSigninCheck } from "reactfire";

interface AuthorizedPageProps {
  children: React.ReactNode;
  whenSignedOut: string;
}

const AuthorizedPage = ({ children, whenSignedOut }: AuthorizedPageProps) => {
  const { status } = useSigninCheck();

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const auth = getAuth();
    const listener = onAuthStateChanged(auth, (user) => {
      const shouldLogOut = !user && whenSignedOut;

      if (shouldLogOut) {
        const path = window.location.pathname;
        if (path !== whenSignedOut) {
          window.location.assign(whenSignedOut);
        }
      }
    });

    return () => listener();
  }, [status, whenSignedOut]);

  return <>{children}</>;
};

export default AuthorizedPage;
