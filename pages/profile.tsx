import SignedInRoute from "@components/routes/SignedInRoute";
import ChangePasswordForm from "@components/users/ChangePasswordForm";
import ProfileForm from "@components/users/ProfileForm";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const Profile = (): ReactElement => {
	const { t } = useTranslation("profile");

	return (
		<SignedInRoute title={t("title")}>
			<ProfileForm />

			<Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
				{t("change-password")}
			</Typography>

			<ChangePasswordForm />
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
			...(await serverSideTranslations(locale, ["common", "profile"])),
		},
	};
};

export default Profile;
