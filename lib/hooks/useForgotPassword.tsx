import { useAuth } from "reactfire";
import { FirebaseError } from "firebase/app";

import { sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useRequestState } from "./useRequestState";
import { useCallback } from "react";

interface Status {
  message: string;
}

export const useForgotPassword = () => {
  const auth = useAuth();

  const { state, setLoading, setData, setError } = useRequestState<Status, FirebaseError>();

  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true);

      try {
        await sendPasswordResetEmail(auth, email);
        setData({ message: "complete" });
      } catch (error) {
        setError(error as FirebaseError);
      }
    },
    [auth, setData, setError, setLoading]
  );

  return [resetPassword, state] as [typeof resetPassword, typeof state];
};
