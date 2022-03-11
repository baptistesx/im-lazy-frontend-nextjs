import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import { User } from "../hooks/useUser";
import { getUser } from "../services/userApi";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await getUser(ctx.req.headers.cookie);
    console.log("user present")
    return { props: { user } };
  } catch (err: any) {
    console.log("iiin dashboard catchh")
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
