import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import SignedInRoute from "../components/SignedInRoute";
import { useAuth } from "../providers/AuthProvider";

function Dashboard() {
  const auth = useAuth();

  return (
    <SignedInRoute>
      <Typography variant="h1">Dashboard</Typography>

      {auth?.user?.isPremium ? (
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

      {!auth?.user?.isEmailVerified ? (
        <Typography>
          Remember to check the confirmation email we sent you.
        </Typography>
      ) : (
        <Box />
      )}
    </SignedInRoute>
  );
}

export default Dashboard;
