import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { Dispatch, ReactElement, SetStateAction } from "react";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";

const GoogleLoginButton = ({
	setIsLoading,
}: {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}): ReactElement => {
	const snackbarsService = useSnackbars();

	const auth = useAuth();

	const isResponseAGoogleLoginResponse = (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	): response is GoogleLoginResponse => {
		return (response as GoogleLoginResponse).accessToken !== null;
	};

	const onGetOauthGoogleTokenSuccess = async (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	): Promise<void> => {
		setIsLoading(true);

		if (isResponseAGoogleLoginResponse(response)) {
			auth?.loginWithGoogle(response.accessToken, () => {
				setIsLoading(false);
			});
		}
	};

	const onGetOauthGoogleTokenFail = async (error: {
		details: string;
	}): Promise<void> => {
		snackbarsService?.addSnackbar({
			message: error?.details,
			severity: "error",
		});
	};

	return (
		<GoogleLogin
			clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
			buttonText="Sign in with Google"
			onSuccess={onGetOauthGoogleTokenSuccess}
			onFailure={onGetOauthGoogleTokenFail}
		/>
	);
};

export default GoogleLoginButton;
