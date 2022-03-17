import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Alert, Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import SignedInRoute from "../components/SignedInRoute";
import GetLicenceButton from "../components/users/GetLicenceButton";
import { useAuth } from "../providers/AuthProvider";
import { isPremium } from "../utils/functions";

function Dashboard() {
  const auth = useAuth();

  return (
    <SignedInRoute>
      <Typography variant="h1">Dashboard</Typography>

      {isPremium(auth?.user) ? (
        <Link href="/workaway-bot">
          <Button variant="contained" sx={{ m: 1 }}>
            Workaway messaging
            <ArrowForwardIcon />
          </Button>
        </Link>
      ) : (
        <GetLicenceButton />
      )}

      {!auth?.user?.isEmailVerified ? (
        <Alert severity={"error"} sx={{ width: "100%" }}>
          Remember to check the confirmation email we sent you.
        </Alert>
      ) : (
        <Box />
      )}
    </SignedInRoute>
  );
}

export default Dashboard;
