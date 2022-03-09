import { Typography, CircularProgress } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import { PAYPAL_SANDBOX_CLIENT_ID } from "../utils/constants";
import CustomPaypalButton from "../components/users/CustomPaypalButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import useUser from "../hooks/useUser";
import Router from "next/router";

function GetLicence() {
  const { user, loading } = useUser();

  if (!user) {
    Router.replace("/");
  }

  return loading || !user ? (
    <GlobalLayout>
      <CircularProgress />
    </GlobalLayout>
  ) : (
    <GlobalLayout>
      <Typography variant="h1">Get the Premium licence</Typography>

      {user?.isPremium ? (
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
    </GlobalLayout>
  );
}

export default GetLicence;
