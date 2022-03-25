import ResetPasswordForm from "@components/auth/ResetPasswordForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const ResetPassword = (): ReactElement => {
	const { t } = useTranslation("auth");

	return (
		<NotSignedInRoute title={t("reset-password")}>
			<ResetPasswordForm />
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
			...(await serverSideTranslations(locale, ["common", "auth"])),
		},
	};
};

export default ResetPassword;
