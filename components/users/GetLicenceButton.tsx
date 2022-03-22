import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button } from "@mui/material";
import Link from "next/link";

const GetLicenceButton = () => (
	<Link href="/get-licence" passHref>
		<Button variant="contained" sx={{ m: 1 }}>
			Get Premium Account to access bots !
			<ArrowForwardIcon />
		</Button>
	</Link>
);

export default GetLicenceButton;
