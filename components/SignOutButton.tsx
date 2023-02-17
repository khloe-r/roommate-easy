import { Button } from "antd";
import { signOut } from "firebase/auth";
import { useCallback } from "react";
import { useAuth } from "reactfire";

const SignOutButton = () => {
  const auth = useAuth();

  const onSignOutRequested = useCallback(() => {
    return signOut(auth);
  }, [auth]);

  return (
    <Button type="primary" onClick={onSignOutRequested}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
