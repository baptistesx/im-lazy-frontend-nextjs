import SignInForm from "@components/auth/SignInForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { ReactElement } from "react";

function SignIn(): ReactElement {
	return (
		<NotSignedInRoute title={"Sign In"}>
			<SignInForm />
		</NotSignedInRoute>
	);
}

export default SignIn;
