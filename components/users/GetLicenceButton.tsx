import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const GetLicenceButton = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<Link href="/get-licence" passHref>
			<Button variant="contained" sx={{ m: 1 }}>
				{t.getLicence["get-premium-account"]}
				<ArrowForwardIcon />
			</Button>
		</Link>
	);
};

export default GetLicenceButton;
