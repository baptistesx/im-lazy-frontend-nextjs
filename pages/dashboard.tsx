import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect } from "react";
import useUser from "../hooks/useUser";

function Dashboard() {
  const router = useRouter();

  const { user, loading, error, loggedIn } = useUser();

  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/");
    }
  }, [loggedIn]);

  return loading || !loggedIn ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Dashboard</Typography>

      {loggedIn && user?.isPremium ? (
        <Link href="/workaway-bot">
          <Button variant="contained" sx={{ m: 1 }}>
            Workaway messaging
            <ArrowForwardIcon />
          </Button>
        </Link>
      ) : (
        <Link href="/get-licence">
          <Button variant="contained" sx={{ m: 1 }}>
            Get Premium Account to access bots !
            <ArrowForwardIcon />
          </Button>
        </Link>
      )}

      {loggedIn && !user?.isEmailVerified ? (
        <Typography>
          Remember to check the confirmation email we sent you.
        </Typography>
      ) : (
        <Box />
      )}
    </GlobalLayout>
  );
}

export default Dashboard;
