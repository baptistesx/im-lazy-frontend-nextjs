import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import { useRouter } from "next/router";
import { User } from "../hooks/useUser";
import { getUser } from "../services/userApi";
import Link from "next/link";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    console.log(ctx.req.headers.cookie);
    const user = await getUser(ctx.req.headers.cookie);
    console.log("GOT USER");
    return { props: { user } };
  } catch (err: any) {
    console.log("NO USER, no token from cookie?");
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

  return (
    <GlobalLayout user={user}>
      <Typography variant="h1">Dashboard</Typography>
      {user?.isPremium ? (
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
