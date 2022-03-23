import SignedInRoute from "@components/routes/SignedInRoute";
import CustomPaypalButton from "@components/users/CustomPaypalButton";
import { Typography } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";

function GetLicence() {
	const auth = useAuth();

	return (
		<SignedInRoute>
			<Typography variant="h1">Get the Premium licence</Typography>

			{auth?.isPremium(auth?.user) ? (
				<Typography variant="body1">
					You are already a premium member
				</Typography>
			) : (
				<>
					<Typography variant="body1">
						Turn your account Premium for only 5€/month !
					</Typography>

					<CustomPaypalButton />
				</>
			)}
		</SignedInRoute>
	);
}

export default GetLicence;
