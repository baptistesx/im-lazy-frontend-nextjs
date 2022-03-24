import SignUpForm from "@components/auth/SignUpForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement } from "react";

const SignUp = (): ReactElement => {
	const { t } = useTranslation("sign-in");

	return (
		<NotSignedInRoute title={t("title")}>
			<SignUpForm />
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
			...(await serverSideTranslations(locale, ["common", "sign-up"])),
		},
	};
};

export default SignUp;
