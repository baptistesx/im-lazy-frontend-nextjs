import SignInForm from "@components/auth/SignInForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";

function SignIn() {
	return (
		<NotSignedInRoute title={"Sign In"}>
			<SignInForm />
		</NotSignedInRoute>
	);
}

export default SignIn;
