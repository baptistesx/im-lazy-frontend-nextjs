import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const Home = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<NotSignedInRoute title={t.index.title}>
			<Typography
				variant="body1"
				sx={{ color: "text.primary", textAlign: "center" }}
			>
				{t.index["welcome-text"]}
			</Typography>

			<Box
				sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Link href="/auth/sign-in" passHref>
					<Button variant="outlined" sx={{ m: 1 }}>
						{t.index["sign-in"]}
					</Button>
				</Link>

				<Typography>|</Typography>

				<Link href="/auth/sign-up" passHref>
					<Button variant="outlined" sx={{ m: 1 }}>
						{t.index["sign-up"]}
					</Button>
				</Link>
			</Box>
		</NotSignedInRoute>
	);
};

export default Home;
