import SignedInRoute from "@components/routes/SignedInRoute";
import GetLicenceButton from "@components/users/GetLicenceButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { sendVerificationEmail } from "@services/userApi";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useState } from "react";

const Dashboard = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [loading, setLoading] = useState<boolean>(false);

	const handleSendVerificationEmailAgain = async (): Promise<void> => {
		if (auth?.value.user?.email === undefined) {
			snackbarsService?.addSnackbar({
				message: t.dashboard["email-not-valid"],
				severity: "error",
			});
		} else {
			setLoading(true);

			sendVerificationEmail(auth.value.user.email, () => {
				setLoading(false);

				snackbarsService?.addSnackbar({
					message: t.dashboard["email-well-sent"],
					severity: "success",
				});
			});
		}
	};

	return (
		<SignedInRoute title={t.dashboard.title}>
			{auth?.isPremium(auth?.value.user) ? (
				<Link href="/workaway-bot" passHref>
					<Button variant="contained" sx={{ m: 1 }}>
						{t.dashboard["bot-name"]}
						<ArrowForwardIcon />
					</Button>
				</Link>
			) : (
				<GetLicenceButton />
			)}

			{!auth?.value.user?.isEmailVerified ? (
				<Alert
					severity="error"
					action={
						<LoadingButton
							variant="outlined"
							loading={loading}
							onClick={handleSendVerificationEmailAgain}
						>
							{t.dashboard["send-again"]}
						</LoadingButton>
					}
					sx={{
						// width: "50%",
						display: "flex",
						justifyContent: "space-between",
						alignContent: "center",
					}}
				>
					{t.dashboard["remember-email-confirmation"]}
				</Alert>
			) : (
				<Box />
			)}
		</SignedInRoute>
	);
};

export default Dashboard;
