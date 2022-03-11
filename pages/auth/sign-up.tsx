import { Typography, CircularProgress } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import React, { useEffect } from "react";
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
function SignUp() {
  return (
    <GlobalLayout>
      <Typography variant="h1">Sign Up</Typography>

      <SignUpForm />
    </GlobalLayout>
  );
}

export default SignUp;
