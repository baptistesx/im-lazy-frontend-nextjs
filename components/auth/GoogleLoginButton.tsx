import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { Dispatch, ReactElement, SetStateAction } from "react";
import GoogleLogin, {
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from "react-google-login";
import { useAuthActions } from "../../providers/AuthActionsProvider";

type GoogleLoginButtonProps = {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const GoogleLoginButton = ({
	setIsLoading,
}: GoogleLoginButtonProps): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const { enqueueSnackbar } = useSnackbar();

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
		} else {
			setIsLoading(false);

			enqueueSnackbar(t.auth["error-sign-in-google"], { variant: "error" });
		}
	};

	const onGetOauthGoogleTokenFail = async (): Promise<void> => {
		enqueueSnackbar(t.auth["error-sign-in-google"], {
			variant: "error",
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
