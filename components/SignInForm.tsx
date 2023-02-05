import { FormEvent, useCallback, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "../lib/hooks/useSignInWithEmailAndPassword";

interface SignInFormProps {
  onSignIn: () => void;
}

const SignInForm = (props: SignInFormProps) => {
  const [signIn, state] = useSignInWithEmailAndPassword();
  const loading = state.loading;
  const error = state.error;

  useEffect(() => {
    if (state.success) {
      props.onSignIn();
    }
  }, [props, state.success]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      const data = new FormData(event.currentTarget);
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      return signIn(email, password);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loading, props, signIn]
  );

  return (
    <form className={"w-full"} onSubmit={onSubmit}>
      <div className={"flex-col space-y-6"}>
        <input required placeholder="Your Email" name="email" type="email" className="TextField" />

        <input required placeholder="Your Password" name="password" type="password" className="TextField" />

        {error ? <span className="text-red-500">{error.message}</span> : null}

        <button disabled={loading} className="Button w-full">
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
