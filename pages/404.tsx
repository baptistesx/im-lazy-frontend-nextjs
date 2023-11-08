import SignedInLayout from "@components/layout/SignedInLayout";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactNode } from "react";

const ResetPassword = (): ReactNode => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<SignedInLayout title={t[404].title}>
			<Link href="/" passHref>
				<Button variant="contained">{t[404]["back-button-message"]}</Button>
			</Link>
		</SignedInLayout>
	);
};

export default ResetPassword;
