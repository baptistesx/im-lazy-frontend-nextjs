import { Box, Typography, CircularProgress } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import BotLogs from "../components/workawayBot/BotLogs";
import FilesSection from "../components/workawayBot/FilesSection";
import InfoForm from "../components/workawayBot/InfoForm";
import useUser from "../hooks/useUser";
import Router from "next/router";

function WorkawayBot() {
  const { user, loading } = useUser();

  if (!user) {
    Router.replace("/");
  }
  if (!user?.isPremium) {
    Router.replace("/getLicence");
  }

  return loading || !user ? (
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
