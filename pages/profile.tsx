import SignedInRoute from "@components/SignedInRoute";
import ChangePasswordForm from "@components/users/ChangePasswordForm";
import ProfileForm from "@components/users/ProfileForm";
import { Typography } from "@mui/material";

function Profile() {
	return (
		<SignedInRoute>
			<Typography variant="h1">Profile</Typography>

			<ProfileForm />

			<Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
				Change Password
			</Typography>

			<ChangePasswordForm />
		</SignedInRoute>
	);
}

export default Profile;
