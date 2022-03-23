import SignUpForm from "@components/auth/SignUpForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";
import { ReactElement } from "react";

function SignUp(): ReactElement {
	return (
		<NotSignedInRoute title={"Sign Up"}>
			<SignUpForm />
		</NotSignedInRoute>
	);
}

export default SignUp;
