import { Button, Typography } from "@mui/material";
import Link from "next/link";
import GlobalLayout from "../components/layout/GlobalLayout";

function ResetPassword() {
  return (
    <GlobalLayout>
      <Typography variant="h1">Page not found (Error 404)</Typography>

      <Link href="/">
        <Button variant="contained">Back to home page</Button>
      </Link>
    </GlobalLayout>
  );
}

export default ResetPassword;
