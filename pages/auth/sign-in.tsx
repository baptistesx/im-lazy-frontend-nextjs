import { Typography, CircularProgress } from "@mui/material";
import SignInForm from "../../components/auth/SignInForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
import React, { useEffect } from "react";

function SignIn() {
  const { loading, loggedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (loggedIn && !loading) {
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return (
    <GlobalLayout>
      {loading || loggedIn ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h1">Sign In</Typography>

          <SignInForm />
        </>
      )}
    </GlobalLayout>
  );
}

export default SignIn;
