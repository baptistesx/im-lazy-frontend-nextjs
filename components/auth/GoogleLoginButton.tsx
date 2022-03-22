import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { GOOGLE_CLIENT_ID } from "@utils/constants";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";

function GoogleLoginButton({ setIsLoading }: { setIsLoading: Function }) {
	const snackbarsService = useSnackbars();

	const auth = useAuth();

	const isResponseAGoogleLoginResponse = (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	): response is GoogleLoginResponse => {
		return (response as GoogleLoginResponse).accessToken !== null;
	};

	const onGetOauthGoogleTokenSuccess = async (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	) => {
		setIsLoading(true);

		if (isResponseAGoogleLoginResponse(response)) {
			auth?.loginWithGoogle(response.accessToken, () => {
				setIsLoading(false);
			});
		}
	};

	const onGetOauthGoogleTokenFail = async (error: any) => {
		snackbarsService?.addAlert({
			message: error?.details,
			severity: "error",
		});
	};

	return (
		<GoogleLogin
			clientId={`${GOOGLE_CLIENT_ID}`}
			buttonText="Sign in with Google"
			onSuccess={onGetOauthGoogleTokenSuccess}
			onFailure={onGetOauthGoogleTokenFail}
		/>
	);
}

export default GoogleLoginButton;
