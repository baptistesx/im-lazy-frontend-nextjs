import { Typography, CircularProgress } from "@mui/material";
import SignInForm from "../../components/auth/SignInForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import Router from "next/router";
import useUser from "../../hooks/useUser";

function SignIn() {
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
      <Typography variant="h1">Sign In</Typography>

      <SignInForm />
    </GlobalLayout>
  );
}

export default SignIn;
