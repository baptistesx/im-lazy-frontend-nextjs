import { Typography, Button } from "@mui/material";
import GlobalLayout from "../components/layout/GlobalLayout";
import React from "react";
import Link from "next/link";

function ResetPassword() {
  return (
    <GlobalLayout showToolbarRightBox={false}>
      <Typography variant="h1">Page not found (Error 404)</Typography>

      <Link href="/">
        <Button variant="contained">Back to home page</Button>
      </Link>
    </GlobalLayout>
  );
}

export default ResetPassword;
