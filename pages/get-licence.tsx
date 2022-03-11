import { Typography } from "@mui/material";
import React from "react";
import GlobalLayout from "../components/layout/GlobalLayout";
import { PAYPAL_SANDBOX_CLIENT_ID } from "../utils/constants";
import CustomPaypalButton from "../components/users/CustomPaypalButton";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { User } from "../hooks/useUser";
import api from "../services/api";

// This gets called on every request
export async function getServerSideProps(ctx: any) {
  // Fetch data from external API
  try {
    const user = await api
      .axiosApiCall("user", "get", {}, ctx.req.headers.cookie)
      .then((res) => res.data);
    return { props: { user } };
  } catch (err: any) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
function GetLicence({ user }: { user: User }) {
  return (
    <GlobalLayout user={user}>
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
