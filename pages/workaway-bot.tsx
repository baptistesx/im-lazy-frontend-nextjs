import { Box, Typography, CircularProgress } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import BotLogs from "../components/workawayBot/BotLogs";
import FilesSection from "../components/workawayBot/FilesSection";
import InfoForm from "../components/workawayBot/InfoForm";
import { User } from "../hooks/useUser";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import api from "../services/api";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await api
      .axiosApiCall("user", "get", {}, ctx.req.headers.cookie)
      .then((res) => res.data);
    return { props: { user } };
  } catch (err: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

function WorkawayBot({ user }: { user: User }) {
  const router = useRouter();

  useEffect(() => {
    if (!user?.isPremium) {
      router.replace("/get-licence");
    }
  }, []);

  return (
    <GlobalLayout user={user}>
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
