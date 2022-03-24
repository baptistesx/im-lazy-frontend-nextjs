import ResetPasswordForm from "@components/auth/ResetPasswordForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const ResetPassword = (): ReactElement => {
	const { t } = useTranslation("reset-password");

	return (
		<NotSignedInRoute title={t("title")}>
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
			...(await serverSideTranslations(locale, ["common", "reset-password"])),
		},
	};
};

export default ResetPassword;
