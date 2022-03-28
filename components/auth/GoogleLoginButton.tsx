import { useSnackbars } from "@providers/SnackbarProvider";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { Dispatch, ReactElement, SetStateAction } from "react";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { useAuthActions } from "../../providers/AuthActionsProvider";

const GoogleLoginButton = ({
	setIsLoading,
}: {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
}): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const snackbarsService = useSnackbars();

	const authActions = useAuthActions();

	const isResponseAGoogleLoginResponse = (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	): response is GoogleLoginResponse =>
		(response as GoogleLoginResponse).accessToken !== null;

	const onGetOauthGoogleTokenSuccess = async (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	): Promise<void> => {
		setIsLoading(true);

		if (isResponseAGoogleLoginResponse(response)) {
			authActions?.loginWithGoogle(response.accessToken, () => {
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
			buttonText={t.auth["sign-in-with-google"]}
			onSuccess={onGetOauthGoogleTokenSuccess}
			onFailure={onGetOauthGoogleTokenFail}
		/>
	);
};

export default GoogleLoginButton;
