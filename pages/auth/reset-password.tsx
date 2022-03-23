import ResetPasswordForm from "@components/auth/ResetPasswordForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { ReactElement } from "react";

function ResetPassword(): ReactElement {
	return (
		<NotSignedInRoute title={"Reset password"}>
			<ResetPasswordForm />
		</NotSignedInRoute>
	);
}

export default ResetPassword;
