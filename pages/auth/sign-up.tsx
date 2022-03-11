import { Typography } from "@mui/material";
import SignUpForm from "../../components/auth/SignUpForm";
import GlobalLayout from "../../components/layout/GlobalLayout";
import React from "react";
import { getUser } from "../../services/userApi";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await getUser(ctx.req.headers.cookie);
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
