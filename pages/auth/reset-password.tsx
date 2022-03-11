import { Typography, CircularProgress } from "@mui/material";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import useUser from "../../hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import api from "../../services/api";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await api
      .axiosApiCall("user", "get", {}, ctx.req.headers.cookie)
      .then((res) => res.data);
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
