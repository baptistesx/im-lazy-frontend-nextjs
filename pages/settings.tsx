import SignedInRoute from "@components/routes/SignedInRoute";
import LanguageMenu from "@components/settings/LanguageMenu";
import ThemeSwitch from "@components/settings/ThemeSwitch";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const Settings = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<SignedInRoute title={t.settings.title}>
			<LanguageMenu />

			<ThemeSwitch />
		</SignedInRoute>
	);
};

export default Settings;
