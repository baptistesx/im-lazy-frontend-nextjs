import SignInForm from "@components/auth/SignInForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const SignIn = (): ReactElement => {
	const { t } = useTranslation("sign-in");

	return (
		<NotSignedInRoute title={t("title")}>
			<SignInForm />
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
			...(await serverSideTranslations(locale, ["common", "sign-in"])),
		},
	};
};

export default SignIn;
