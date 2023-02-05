import { useCallback } from "react";
import { useRouter } from "next/router";

import SignInForm from "@/components/SignInForm";

const SignIn = () => {
  const router = useRouter();

  const onSignin = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="AuthContainer">
      <h1 className="Hero">Sign In</h1>

      <SignInForm onSignIn={onSignin} />
    </div>
  );
};

export default SignIn;
