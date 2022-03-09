import { Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

function Home() {
  const { user, loading, error, loggedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (loggedIn) {
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return loading || loggedIn ? (
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
