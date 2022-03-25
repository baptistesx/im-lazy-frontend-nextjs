import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement } from "react";

const GetLicenceButton = (): ReactElement => {
	const { t } = useTranslation("get-licence");

	return (
		<Link href="/get-licence" passHref>
			<Button variant="contained" sx={{ m: 1 }}>
				{t("get-premium-account")}
				<ArrowForwardIcon />
			</Button>
		</Link>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "get-licence"])),
		},
	};
};

export default GetLicenceButton;
