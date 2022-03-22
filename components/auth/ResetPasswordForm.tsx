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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type ResetPasswordFormData = {
	email: string;
};

const ResetPasswordForm = () => {
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
		const subscription = watch((value, { name, type }) => {});
		return () => subscription.unsubscribe();
	}, [watch]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		setIsLoading(true);

		resetPassword(data.email, () => {
			setIsLoading(false);

			snackbarsService?.addAlert({
				message: "If email is valid, a reset password email has been sent",
				severity: "success",
			});

			reset(data);
		}).catch((err: Error) => {
			setIsLoading(false);

			snackbarsService?.addAlert({
				message: "An error occured while sending a reset password email",
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
