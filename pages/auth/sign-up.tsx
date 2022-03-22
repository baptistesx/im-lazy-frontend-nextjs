import SignUpForm from "@components/auth/SignUpForm";
import NotSignedInRoute from "@components/routes/NotSignedInRoute";

function SignUp() {
	return (
		<NotSignedInRoute title={"Sign Up"}>
			<SignUpForm />
		</NotSignedInRoute>
	);
}

export default SignUp;
