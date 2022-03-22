import { PayPalButtonsComponentOptions } from "@paypal/paypal-js/types/components/buttons";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useSnackbars } from "@providers/SnackbarProvider";
import { savePayment } from "@services/userApi";
import { PAYPAL_CLIENT_ID, PAYPAL_SANDBOX_CLIENT_ID } from "@utils/constants";
import { useRouter } from "next/router";

const paypalScriptOptions: PayPalScriptOptions = {
	// TODO: how to simplify that?
	"client-id":
		process.env.NODE_ENV === "production"
			? PAYPAL_CLIENT_ID
				? PAYPAL_CLIENT_ID
				: PAYPAL_SANDBOX_CLIENT_ID
				? PAYPAL_SANDBOX_CLIENT_ID
				: ""
			: PAYPAL_SANDBOX_CLIENT_ID
			? PAYPAL_SANDBOX_CLIENT_ID
			: "",
	currency: "EUR",
	components: "buttons",
};

function CustomButton() {
	const snackbarsService = useSnackbars();

	const router = useRouter();

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
							value: "5",
						},
					},
				],
			});
		},
		async onApprove(data: any, actions: any) {
			/**
			 * data: {
			 *   orderID: string;
			 *   payerID: string;
			 *   paymentID: string | null;
			 *   billingToken: string | null;
			 *   facilitatorAccesstoken: string;
			 * }
			 */
			const details: any = await actions.order.capture({});

			const resume = {
				...data,
				createTime: details.create_time,
				updateTime: details.update_time,
				payer: {
					email: details.payer.email_address,
					name: details.payer.name.given_name,
					surname: details.payer.name.surname,
					id: details.payer.payer_id,
					address: details.purchase_units[0].shipping.address,
				},
				amount: details.purchase_units[0].amount.value,
				currency: details.purchase_units[0].amount.currency_code,
				status: details.status,
				merchandEmail: details.purchase_units[0].payee.email_address,
				merchandId: details.purchase_units[0].payee.email_id,
			};

			savePayment(resume, () => {
				snackbarsService?.addAlert({
					message: "Payment well saved, you're now premium member!",
					severity: "success",
				});

				router.push("/dashboard");
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
