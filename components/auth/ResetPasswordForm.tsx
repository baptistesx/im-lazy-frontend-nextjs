import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	TextField,
} from "@mui/material";
import { useSnackbars } from "@providers/SnackbarProvider";
import resetPasswordFormSchema from "@schemas/resetPasswordFormSchema";
import { resetPassword } from "@services/userApi";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordFormData } from "./auth.d";

const ResetPasswordForm = (): ReactElement => {
	const snackbarsService = useSnackbars();

	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { isDirty, errors },
		reset,
	} = useForm<ResetPasswordFormData>({
		resolver: yupResolver(resetPasswordFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});

		return () => subscription.unsubscribe();
	}, [watch]);

	const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
		setIsLoading(true);

		resetPassword(data.email, () => {
			setIsLoading(false);

			snackbarsService?.addSnackbar({
				message: t.auth["email-well-sent"],
				severity: "success",
			});

			reset(data);
		}).catch(() => {
			setIsLoading(false);

			snackbarsService?.addSnackbar({
				message: t.auth["error-sending-email"],
				severity: "error",
			});
		});
	};

	return (
		<Card component="form" onSubmit={handleSubmit(onSubmit)}>
			<CardContent>
				<TextField
					fullWidth
					label={t.common.email}
					{...register("email")}
					error={errors.email != null}
					helperText={errors.email?.message}
				/>
			</CardContent>

			<CardActions>
				<LoadingButton
					sx={{
						m: 1,
					}}
					type="submit"
					variant="contained"
					disabled={!isDirty}
					loading={isLoading}
				>
					{t.auth["reset-password"]}
				</LoadingButton>

				<Link href="/auth/sign-in" passHref>
					<Button
						sx={{
							m: 1,
						}}
					>
						{t.common.back}
					</Button>
				</Link>
			</CardActions>
		</Card>
	);
};

export default ResetPasswordForm;
