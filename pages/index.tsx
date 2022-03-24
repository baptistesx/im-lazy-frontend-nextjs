import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { Box, Button, Link, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Home = (): ReactElement => {
	const { t } = useTranslation("index");

	return (
		<NotSignedInRoute title={t("title")}>
			<Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
				{t("welcome-text")}
			</Typography>

			<Box
				sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
			>
				<Link href="/auth/sign-in">
					<Button
						variant="outlined"
						sx={{ color: "white", borderColor: "white", m: 1 }}
					>
						{t("sign-in")}
					</Button>
				</Link>

				<Typography sx={{ color: "white" }}>|</Typography>

				<Link href="/auth/sign-up">
					<Button
						variant="outlined"
						sx={{ color: "white", borderColor: "white", m: 1 }}
					>
						{t("sign-up")}
					</Button>
				</Link>
			</Box>
		</NotSignedInRoute>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "index"])),
		},
	};
};

export default Home;
