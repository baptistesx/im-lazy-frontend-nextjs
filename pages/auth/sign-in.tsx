import SignInForm from "@components/auth/SignInForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const SignIn = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<NotSignedInRoute title={t.auth["sign-in"]}>
			<SignInForm />
		</NotSignedInRoute>
	);
};

export default SignIn;
