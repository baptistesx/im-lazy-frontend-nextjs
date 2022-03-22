import SignedInRoute from "@components/SignedInRoute";
import CustomPaypalButton from "@components/users/CustomPaypalButton";
import { Typography } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { PAYPAL_CLIENT_ID } from "@utils/constants";

function GetLicence() {
	const auth = useAuth();
	console.log(PAYPAL_CLIENT_ID);
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
