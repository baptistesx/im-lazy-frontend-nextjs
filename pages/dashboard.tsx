import { CustomSnackbar } from "@components/layout/CustomSnackbar";
import SignedInRoute from "@components/routes/SignedInRoute";
import GetLicenceButton from "@components/users/GetLicenceButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { sendVerificationEmail } from "@services/userApi";
import Link from "next/link";
import { ReactElement, useState } from "react";

const Dashboard = (): ReactElement => {
	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [loading, setLoading] = useState<boolean>(false);

	const handleSendVerificationEmailAgain = async (): Promise<void> => {
		if (auth?.value.user?.email === undefined) {
			snackbarsService?.addSnackbar({
				message: "Email not valid.",
				severity: "error",
			});
		} else {
			setLoading(true);

			sendVerificationEmail(auth.value.user.email, () => {
				setLoading(false);

				snackbarsService?.addSnackbar({
					message: "Confirmation email has been well sent",
					severity: "success",
				});
			});
		}
	};

	return (
		<SignedInRoute>
			<Typography variant="h1">Dashboard</Typography>

			{auth?.isPremium(auth?.value.user) ? (
				<Link href="/workaway-bot" passHref>
					<Button variant="contained" sx={{ m: 1 }}>
						Workaway messaging
						<ArrowForwardIcon />
					</Button>
				</Link>
			) : (
				<GetLicenceButton />
			)}

			{!auth?.value.user?.isEmailVerified ? (
				<CustomSnackbar
					snackbarMessage={{
						message: "Remember to check the confirmation email we sent you.",
						severity: "error",
					}}
				>
					<LoadingButton
						variant="outlined"
						loading={loading}
						onClick={handleSendVerificationEmailAgain}
					>
						Send again
					</LoadingButton>
				</CustomSnackbar>
			) : (
				<Box />
			)}
		</SignedInRoute>
	);
};

export default Dashboard;
