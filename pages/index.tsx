import { Typography, Box, Link, Button } from "@mui/material";
import NotSignedInRoute from "../components/NotSignedInRoute";

function Home() {
  return (
    <NotSignedInRoute title="Home">
      <Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
        Welcome on ImLazy.dev! You'll find here different ressources to save
        time in your life...
      </Typography>

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Link href="/auth/sign-in">
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white", m: 1 }}
          >
            Sign In
          </Button>
        </Link>

        <Typography sx={{ color: "white" }}>|</Typography>

        <Link href="/auth/sign-up">
          <Button
            variant="outlined"
            sx={{ color: "white", borderColor: "white", m: 1 }}
          >
            Sign Up
          </Button>
        </Link>
      </Box>
    </NotSignedInRoute>
  );
}

export default Home;
