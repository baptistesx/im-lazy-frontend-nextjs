import ResetPasswordForm from "@components/auth/ResetPasswordForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";

function ResetPassword() {
	return (
		<NotSignedInRoute title={"Reset password"}>
			<ResetPasswordForm />
		</NotSignedInRoute>
	);
}

export default ResetPassword;
