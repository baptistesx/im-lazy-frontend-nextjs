import { Typography } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import NotSignedInRoute from "../../components/NotSignedInRoute";

function SignUp() {
  return (
    <NotSignedInRoute>
      <Typography variant="h1">Sign Up</Typography>

      <SignUpForm />
    </NotSignedInRoute>
  );
}

export default SignUp;
