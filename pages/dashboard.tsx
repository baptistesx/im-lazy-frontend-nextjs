import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

function Dashboard() {
  const router = useRouter();

  const { user, loading, error, loggedIn } = useUser();

  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/");
    }
  }, [loggedIn]);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return loading || !loggedIn ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Dashboard</Typography>

      {user?.isPremium ? (
        <Button
          onClick={() => handleNavigate("/workaway-bot")}
          variant="contained"
          sx={{ m: 1 }}
        >
          Workaway messaging
          <ArrowForwardIcon />
        </Button>
      ) : (
        <Button
          onClick={() => handleNavigate("/get-licence")}
          variant="contained"
          sx={{ m: 1 }}
        >
          Get Premium Account to access bots !
          <ArrowForwardIcon />
        </Button>
      )}

      {!user?.isEmailVerified ? (
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
