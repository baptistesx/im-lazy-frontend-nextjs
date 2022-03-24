import { CustomSnackbar } from "@components/layout/CustomSnackbar";
import SignedInRoute from "@components/routes/SignedInRoute";
import GetLicenceButton from "@components/users/GetLicenceButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useAuth } from "@providers/AuthProvider";
import { useSnackbars } from "@providers/SnackbarProvider";
import { sendVerificationEmail } from "@services/userApi";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { ReactElement, useState } from "react";

const Dashboard = (): ReactElement => {
	const { t } = useTranslation("sign-in");

	const auth = useAuth();

	const snackbarsService = useSnackbars();

	const [loading, setLoading] = useState<boolean>(false);

	const handleSendVerificationEmailAgain = async (): Promise<void> => {
		if (auth?.value.user?.email === undefined) {
			snackbarsService?.addSnackbar({
				message: t("email-not-valid"),
				severity: "error",
			});
		} else {
			setLoading(true);

			sendVerificationEmail(auth.value.user.email, () => {
				setLoading(false);

				snackbarsService?.addSnackbar({
					message: t("email-well-sent"),
					severity: "success",
				});
			});
		}
	};

	return (
		<SignedInRoute title={t("title")}>
			{auth?.isPremium(auth?.value.user) ? (
				<Link href="/workaway-bot" passHref>
					<Button variant="contained" sx={{ m: 1 }}>
						{t("bot-name")}
						<ArrowForwardIcon />
					</Button>
				</Link>
			) : (
				<GetLicenceButton />
			)}

			{!auth?.value.user?.isEmailVerified ? (
				<CustomSnackbar
					snackbarMessage={{
						message: t("remember-email-confirmation"),
						severity: "error",
					}}
				>
					<LoadingButton
						variant="outlined"
						loading={loading}
						onClick={handleSendVerificationEmailAgain}
					>
						{t("send-again")}
					</LoadingButton>
				</CustomSnackbar>
			) : (
				<Box />
			)}
		</SignedInRoute>
	);
};

export const getStaticProps = async ({
	locale,
}: {
	locale: string;
}): Promise<{ props: unknown }> => {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "dashboard"])),
		},
	};
};

export default Dashboard;
