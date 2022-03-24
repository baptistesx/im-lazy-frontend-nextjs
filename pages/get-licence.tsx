import SignedInRoute from "@components/routes/SignedInRoute";
import CustomPaypalButton from "@components/users/CustomPaypalButton";
import { Typography } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const GetLicence = (): ReactElement => {
	const { t } = useTranslation("get-licence");

	const auth = useAuth();

	return (
		<SignedInRoute title={t("title")}>
			{auth?.isPremium(auth?.value.user) ? (
				<Typography variant="body1">{t("already-premium")}</Typography>
			) : (
				<>
					<Typography variant="body1">{t("get-premium-account")}</Typography>

					<CustomPaypalButton />
				</>
			)}
		</SignedInRoute>
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

export default GetLicence;
