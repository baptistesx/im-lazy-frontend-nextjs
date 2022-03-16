import { PayPalButtonsComponentOptions } from "@paypal/paypal-js/types/components/buttons";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { PAYPAL_SANDBOX_CLIENT_ID } from "../../utils/constants";

const paypalScriptOptions: PayPalScriptOptions = {
  "client-id": PAYPAL_SANDBOX_CLIENT_ID ?? "test",
  currency: "USD",
};

function CustomButton() {
  /**
   * usePayPalScriptReducer use within PayPalScriptProvider
   * isPending: not finished loading(default state)
   * isResolved: successfully loaded
   * isRejected: failed to load
   */
  const [{ isPending }] = usePayPalScriptReducer();
  const paypalbuttonTransactionProps: PayPalButtonsComponentOptions = {
    style: { layout: "vertical" },
    createOrder(data: any, actions: any) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: "0.01",
            },
          },
        ],
      });
    },
    onApprove(data: any, actions: any) {
      /**
       * data: {
       *   orderID: string;
       *   payerID: string;
       *   paymentID: string | null;
       *   billingToken: string | null;
       *   facilitatorAccesstoken: string;
       * }
       */
      return actions.order.capture({}).then((details: any) => {
        //TODO: store details & data in db
        alert(
          "Transaction completed by" +
            (details?.payer.name.given_name ?? "No details")
        );

        alert("Data details: " + JSON.stringify(data, null, 2));
      });
    },
  };
  return (
    <>
      {isPending ? <h2>Load Smart Payment Button...</h2> : null}
      <PayPalButtons {...paypalbuttonTransactionProps} />
    </>
  );
}

export default function CustomPaypalButton() {
  return (
    <PayPalScriptProvider options={paypalScriptOptions}>
      <CustomButton />
    </PayPalScriptProvider>
  );
}
