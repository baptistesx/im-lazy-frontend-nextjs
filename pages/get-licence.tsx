import SignedInRoute from "@components/routes/SignedInRoute";
import CustomPaypalButton from "@components/users/CustomPaypalButton";
import { Typography } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement } from "react";

const GetLicence = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();

	return (
		<SignedInRoute title={t.getLicence.title}>
			{auth?.isPremium(auth?.value.user) ? (
				<Typography variant="body1">
					{t.getLicence["already-premium"]}
				</Typography>
			) : (
				<>
					<Typography variant="body1">
						{t.getLicence["get-premium-account"]}
					</Typography>

					<CustomPaypalButton />
				</>
			)}
		</SignedInRoute>
	);
};

export default GetLicence;
