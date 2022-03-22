import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import SignedInRoute from "../components/SignedInRoute";
import GetLicenceButton from "../components/users/GetLicenceButton";
import { useAuth } from "../providers/AuthProvider";
import { useSnackbars } from "../providers/SnackbarProvider";
import { sendVerificationEmail } from "../services/userApi";
import { isPremium } from "../utils/functions";

function Dashboard() {
	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [loading, setLoading] = useState<boolean>(false);

	const handleSendVerificationEmailAgain = async () => {
		setLoading(true);

		sendVerificationEmail(auth?.user?.email, () => {
			setLoading(false);

			snackbarsService?.addAlert({
				message: "Confirmation email has been well sent",
				severity: "success",
			});
		}).catch((err: Error) => {});
	};

	return (
		<SignedInRoute>
			<Typography variant="h1">Dashboard</Typography>

			{isPremium(auth?.user) ? (
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
				<Alert severity={"error"} sx={{ width: "100%" }}>
					<Typography>
						Remember to check the confirmation email we sent you.
					</Typography>

					<LoadingButton
						variant="outlined"
						loading={loading}
						onClick={handleSendVerificationEmailAgain}
					>
						Send again
					</LoadingButton>
				</Alert>
			) : (
				<Box />
			)}
		</SignedInRoute>
	);
}

export default Dashboard;
