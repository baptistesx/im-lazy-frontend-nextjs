import { Typography } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import NotSignedInRoute from "../../components/NotSignedInRoute";

function ResetPassword() {
  return (
    <NotSignedInRoute>
      <Typography variant="h1">Reset password</Typography>

      <ResetPasswordForm />
    </NotSignedInRoute>
  );
}

export default ResetPassword;
