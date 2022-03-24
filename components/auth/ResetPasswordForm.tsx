import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Link,
	TextField,
} from "@mui/material";
import { useSnackbars } from "@providers/SnackbarProvider";
import resetPasswordFormSchema from "@schemas/resetPasswordFormSchema";
import { resetPassword } from "@services/userApi";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ResetPasswordFormData = {
	email: string;
};

const ResetPasswordForm = (): ReactElement => {
	const snackbarsService = useSnackbars();

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
				message: "If email is valid, a reset password email has been sent",
				severity: "success",
			});

			reset(data);
		}).catch(() => {
			setIsLoading(false);

			snackbarsService?.addSnackbar({
				message: "An error occurred while sending a reset password email",
				severity: "error",
			});
		});
	};

	return (
		<Card component="form" onSubmit={handleSubmit(onSubmit)}>
			<CardContent>
				<TextField
					fullWidth
					placeholder="Email"
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
					Reset password
				</LoadingButton>

				<Link href="/auth/sign-in">
					<Button
						sx={{
							m: 1,
						}}
					>
						Back
					</Button>
				</Link>
			</CardActions>
		</Card>
	);
};

export default ResetPasswordForm;
