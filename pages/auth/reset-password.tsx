import { Typography, CircularProgress } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import React from "react";
import { getUser } from "../../services/userApi";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await getUser(ctx.req.headers.cookie);
    console.log("should redirect to dashboard");
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (err: any) {
    console.log("should not bee heeere");
    return { props: {} };
  }
}

function ResetPassword() {
  return (
    <GlobalLayout>
      <Typography variant="h1">Reset password</Typography>

      <ResetPasswordForm />
    </GlobalLayout>
  );
}

export default ResetPassword;
