import { Box, CircularProgress, Typography } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import BotLogs from "../components/workawayBot/BotLogs";
import FilesSection from "../components/workawayBot/FilesSection";
import InfoForm from "../components/workawayBot/InfoForm";
import useUser, { User } from "../hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { getUser } from "../services/userApi";

function WorkawayBot() {
  const { user, loading, loggedIn } = useUser();

  const router = useRouter();

  useEffect(() => {
    if (!loggedIn && !loading) {
      router.push("/");
    } else if (!user?.isPremium) {
      router.replace("/get-licence");
    }
  }, [loggedIn]);

  return loading || !loggedIn ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Workaway Bot</Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <InfoForm />

        <BotLogs />
      </Box>

      <FilesSection />
    </GlobalLayout>
  );
}

export default WorkawayBot;
