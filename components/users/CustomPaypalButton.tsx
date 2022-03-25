import {
	OnApproveActions,
	OnApproveData,
	PayPalButtonsComponentOptions,
} from "@paypal/paypal-js/types/components/buttons";
import { PayPalScriptOptions } from "@paypal/paypal-js/types/script-options";
import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useSnackbars } from "@providers/SnackbarProvider";
import { savePayment } from "@services/userApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const paypalScriptOptions: PayPalScriptOptions = {
	"client-id":
		process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== undefined
			? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
			: "",
	currency: "EUR",
	components: "buttons",
};

const CustomButton = (): ReactElement => {
	const { t } = useTranslation("get-licence");

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
		createOrder(data, actions) {
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
		async onApprove(data: OnApproveData, actions: OnApproveActions) {
			const details = await actions.order?.capture();

			const resume = {
				...data,
				createTime: details?.create_time,
				updateTime: details?.update_time,
				payer: {
					email: details?.payer.email_address,
					name: details?.payer.name.given_name,
					surname: details?.payer.name.surname,
					id: details?.payer.payer_id,
					address: details?.purchase_units[0]?.shipping?.address,
				},
				amount: details?.purchase_units[0].amount.value,
				currency: details?.purchase_units[0].amount.currency_code,
				status: details?.status,
				merchandEmail: details?.purchase_units[0]?.payee?.email_address,
				merchandId: details?.purchase_units[0]?.payee?.merchant_id,
			};

			savePayment(resume, () => {
				snackbarsService?.addSnackbar({
					message: t("payment-well-saved"),
					severity: "success",
				});

				router.push("/dashboard");
			});
		},
	};
	return (
		<>
			{isPending ? <h2>{t("loading-button")}</h2> : null}
			<PayPalButtons {...paypalbuttonTransactionProps} />
		</>
	);
};

const CustomPaypalButton = (): ReactElement => {
	return (
		<PayPalScriptProvider options={paypalScriptOptions}>
			<CustomButton />
		</PayPalScriptProvider>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "get-licence"])),
		},
	};
};

export default CustomPaypalButton;
