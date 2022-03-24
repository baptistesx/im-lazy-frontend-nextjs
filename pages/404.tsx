import SignedInLayout from "@components/layout/SignedInLayout";
import { Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactNode } from "react";

const ResetPassword = (): ReactNode => {
	const { t } = useTranslation("404");

	return (
		<SignedInLayout title={t("title")}>
			<Link href="/" passHref>
				<Button variant="contained">{t("back-button-message")}</Button>
			</Link>
		</SignedInLayout>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "404"])),
		},
	};
};

export default ResetPassword;
