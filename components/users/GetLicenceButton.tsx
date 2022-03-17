import { Button } from "@mui/material";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const GetLicenceButton = () => (
  <Link href="/get-licence">
    <Button variant="contained" sx={{ m: 1 }}>
      Get Premium Account to access bots !
      <ArrowForwardIcon />
    </Button>
  </Link>
);

export default GetLicenceButton;
