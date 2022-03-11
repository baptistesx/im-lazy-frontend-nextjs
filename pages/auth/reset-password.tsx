import { Typography, CircularProgress } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import useUser from "../../hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function ResetPassword() {
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
          <Typography variant="h1">Reset password</Typography>

          <ResetPasswordForm />
        </>
      )}
    </GlobalLayout>
  );
}

export default ResetPassword;
