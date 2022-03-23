import { CustomAlert } from "@components/layout/CustomAlert";
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
		if (auth?.user?.email === undefined) {
			snackbarsService?.addAlert({
				message: "Email not valid.",
				severity: "error",
			});
		} else {
			setLoading(true);

			sendVerificationEmail(auth.user.email, () => {
				setLoading(false);

				snackbarsService?.addAlert({
					message: "Confirmation email has been well sent",
					severity: "success",
				});
			});
		}
	};

	return (
		<SignedInRoute>
			<Typography variant="h1">Dashboard</Typography>

			{auth?.isPremium(auth?.user) ? (
				<Link href="/workaway-bot" passHref>
					<Button variant="contained" sx={{ m: 1 }}>
						Workaway messaging
						<ArrowForwardIcon />
					</Button>
				</Link>
			) : (
				<GetLicenceButton />
			)}

			{!auth?.user?.isEmailVerified ? (
				<CustomAlert
					alert={{
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
				</CustomAlert>
			) : (
				<Box />
			)}
		</SignedInRoute>
	);
};

export default Dashboard;
