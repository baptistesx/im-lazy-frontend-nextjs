import { Typography } from "@mui/material";
import SignInForm from "../../components/auth/SignInForm";
import NotSignedInRoute from "../../components/NotSignedInRoute";

function SignIn() {
  return (
    <NotSignedInRoute>
      <Typography variant="h1">Sign In</Typography>

      <SignInForm />
    </NotSignedInRoute>
  );
}

export default SignIn;
