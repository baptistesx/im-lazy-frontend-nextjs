import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import useSnackbars from "../../hooks/useSnackbars";
import { User } from "../../hooks/useUser";
import { signInWithGoogle } from "../../services/userApi";
import { GOOGLE_CLIENT_ID } from "../../utils/constants";
import { useRouter } from "next/router";

function GoogleLoginButton({ setIsLoading }: { setIsLoading: Function }) {
  const snackbarsService = useSnackbars();

  const router = useRouter();

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
      signInWithGoogle(response.accessToken, (user: User) => {
        setIsLoading(false);

        snackbarsService?.addAlert({
          message: "Welcome", // TODO: use custom message if new user
          severity: "success",
        });

        router.replace("/dashboard");
      }).catch((err: Error) => {
        setIsLoading(false);

        snackbarsService?.addAlert({
          message: "An error occured while signing in with Google",
          severity: "error",
        });
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
      buttonText="Sign up with Google"
      onSuccess={onGetOauthGoogleTokenSuccess}
      onFailure={onGetOauthGoogleTokenFail}
    />
  );
}

export default GoogleLoginButton;
