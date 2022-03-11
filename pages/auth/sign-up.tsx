import { Typography, CircularProgress } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import useUser from "../../hooks/useUser";
import React, { useEffect } from "react";

function SignUp() {
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
          <Typography variant="h1">Sign Up</Typography>

          <SignUpForm />
        </>
      )}
    </GlobalLayout>
  );
}

export default SignUp;
