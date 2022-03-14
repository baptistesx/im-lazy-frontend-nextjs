import { Typography, Button } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import React from "react";

function ResetPassword() {
  return (
    <GlobalLayout showToolbarRightBox={false}>
      <Typography variant="h1">Page not found (Error 404)</Typography>

      <Button variant="contained" href="/">
        Back to home page
      </Button>
    </GlobalLayout>
  );
}

export default ResetPassword;
