import { Typography, CircularProgress } from "@mui/material";
import SignInForm from "../../components/auth/SignInForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import React from "react";
import api from "../../services/api";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await api
      .axiosApiCall("user", "get", {}, ctx.req.headers.cookie)
      .then((res) => res.data);
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (err: any) {
    return { props: {} };
  }
}

function SignIn() {
  return (
    <GlobalLayout>
      <Typography variant="h1">Sign In</Typography>

      <SignInForm />
    </GlobalLayout>
  );
}

export default SignIn;
