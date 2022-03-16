import { Typography } from "@mui/material";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import SignedInRoute from "../components/SignedInRoute";
import CustomPaypalButton from "../components/users/CustomPaypalButton";
import { useAuth } from "../providers/AuthProvider";
import { PAYPAL_SANDBOX_CLIENT_ID } from "../utils/constants";

function GetLicence() {
  const auth = useAuth();

  return (
    <SignedInRoute>
      <Typography variant="h1">Get the Premium licence</Typography>

      {auth?.user?.isPremium ? (
        <Typography variant="body1">
          You are already a premium member
        </Typography>
      ) : (
        <>
          <Typography variant="body1">
            Turn your account Premium for only 5€/month !
          </Typography>

          {/* //TODO: update client-id for production*/}
          <PayPalScriptProvider
            options={{
              "client-id": PAYPAL_SANDBOX_CLIENT_ID ?? "test",
              components: "buttons",
              currency: "EUR",
            }}
          >
            <CustomPaypalButton />
          </PayPalScriptProvider>
        </>
      )}
    </SignedInRoute>
  );
}

export default GetLicence;
