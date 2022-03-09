import { Typography, CircularProgress } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import useUser from "../../hooks/useUser";
import Router from "next/router";

function ResetPassword() {
  const { user, loading } = useUser();

  if (user) {
    Router.replace("/dashboard");
  }

  return loading || user ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Reset password</Typography>

      <ResetPasswordForm />
    </GlobalLayout>
  );
}

export default ResetPassword;
