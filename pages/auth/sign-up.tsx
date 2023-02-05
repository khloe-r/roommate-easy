import { useCallback } from "react";
import { useRouter } from "next/router";

import SignUpForm from "@/components/SignUpForm";

const SignUp = () => {
  const router = useRouter();

  const onSignup = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="AuthContainer">
      <h1 className="Hero">Sign Up</h1>

      <SignUpForm onSignup={onSignup} />
    </div>
  );
};

export default SignUp;
