import { Button, Typography } from "@mui/material";
import Link from "next/link";
import SignedInLayout from "../components/layout/SignedInLayout";

function ResetPassword() {
  return (
    <SignedInLayout>
      <Typography variant="h1">Page not found (Error 404)</Typography>

      <Link href="/">
        <Button variant="contained">Back to home page</Button>
      </Link>
    </SignedInLayout>
  );
}

export default ResetPassword;
