import { Box, Typography } from "@mui/material";
import PremiumRoute from "../components/PremiumRoute";
import BotLogs from "../components/workawayBot/BotLogs";
import FilesSection from "../components/workawayBot/FilesSection";
import InfoForm from "../components/workawayBot/InfoForm";

function WorkawayBot() {
  return (
    <PremiumRoute>
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
    </PremiumRoute>
  );
}

export default WorkawayBot;
