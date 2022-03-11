import { Typography } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import api from "../services/api";

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  try {
    await api.axiosApiCall("user", "get", {}, "").then((res) => res);

    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  } catch (err: any) {
    return { props: {} };
  }
}

function Home() {
  return (
    <GlobalLayout>
      <Typography variant="h1">Home</Typography>

      <Typography variant="body1">
        Welcome on ImLazy.dev! You'll find here different ressources to save
        time in your life...
      </Typography>
    </GlobalLayout>
  );
}

export default Home;
