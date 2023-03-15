import SignedInRoute from "@components/routes/SignedInRoute";
import ChangePasswordForm from "@components/users/ChangePasswordForm";
import ProfileForm from "@components/users/ProfileForm";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const Profile = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	return (
		<SignedInRoute title={t.profile.title}>
			<ProfileForm />

			<Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
				{t.profile["change-password"]}
			</Typography>

			<ChangePasswordForm />
		</SignedInRoute>
	);
};

export default Profile;
