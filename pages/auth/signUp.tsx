import { Typography, CircularProgress } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import Router from "next/router";
import useUser from "../../hooks/useUser";

function SignUp() {
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
      <Typography variant="h1">Sign Up</Typography>

      <SignUpForm />
    </GlobalLayout>
  );
}

export default SignUp;
