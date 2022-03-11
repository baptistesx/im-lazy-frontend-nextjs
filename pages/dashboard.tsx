import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import api from "../services/api";
import { User } from "../hooks/useUser";

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

function Dashboard({ user }: { user: User }) {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <GlobalLayout user={user}>
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
