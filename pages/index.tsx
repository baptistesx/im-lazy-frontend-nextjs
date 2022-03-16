import { Typography } from "@mui/material";
import NotSignedInRoute from "../components/NotSignedInRoute";

function Home() {
  return (
    <NotSignedInRoute>
      <Typography variant="h1">Home</Typography>

      <Typography variant="body1">
        Welcome on ImLazy.dev! You'll find here different ressources to save
        time in your life...
      </Typography>
    </NotSignedInRoute>
  );
}

export default Home;
