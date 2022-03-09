import { Typography, CircularProgress } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
import React, { useEffect } from "react";

function SignUp() {
  const { user, loading, loggedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (loggedIn) {
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return loading || loggedIn ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Sign Up</Typography>

      <SignUpForm />
    </GlobalLayout>
  );
}

export default SignUp;
