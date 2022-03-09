import { Typography, CircularProgress } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import useUser from "../hooks/useUser";
import Router from "next/router";

function Home() {
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
      <Typography variant="h1">Home</Typography>

      <Typography variant="body1">
        Welcome on ImLazy.dev! You'll find here different ressources to save
        time in your life...
      </Typography>
    </GlobalLayout>
  );
}

export default Home;
