import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	IconButton,
	TextField,
} from "@mui/material";
import { useAuthActions } from "@providers/AuthActionsProvider";
import signUpFormSchema from "@schemas/signUpFormSchema";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpSubmitFormData } from "./auth.d";
import GoogleLoginButton from "./GoogleLoginButton";

//TODO: on google signin, ask to choose an account and don't directly connect to the last used (remove token?)

const SignUpForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] =
		useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { isDirty, errors },
		reset,
	} = useForm<SignUpSubmitFormData>({
		resolver: yupResolver(signUpFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});

		return () => subscription.unsubscribe();
	}, [watch]);

	const onSubmit = (data: SignUpSubmitFormData): void => {
		setIsSigningUp(true);

		authActions?.register(data.name, data.email, data.password, () => {
			setIsSigningUp(false);

			reset(data);
		});
	};

	const handleClickShowPassword = (): void => {
		setShowPassword(!showPassword);
	};

	const handleClickShowPasswordConfirmation = (): void => {
		setShowPasswordConfirmation(!showPasswordConfirmation);
	};

	return (
		<Card
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ minWidth: 320, maxWidth: 500 }}
		>
			<CardContent>
				<TextField
					fullWidth
					label={t.common.name}
					sx={{ mb: 2 }}
					{...register("name")}
					error={errors.name != null}
					helperText={errors.name?.message}
				/>

				<TextField
					fullWidth
					label={t.common.email}
					sx={{ mb: 2 }}
					{...register("email")}
					error={errors.email != null}
					helperText={errors.email?.message}
				/>

				<TextField
					fullWidth
					type={showPassword ? "text" : "password"}
					label={t.common.password}
					InputProps={{
						endAdornment: (
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						),
					}}
					sx={{ mb: 2 }}
					{...register("password")}
					error={errors.password != null}
					helperText={errors.password?.message}
				/>

				<TextField
					fullWidth
					type={showPasswordConfirmation ? "text" : "password"}
					label={t.auth["confirm-password"]}
					InputProps={{
						endAdornment: (
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPasswordConfirmation}
								edge="end"
							>
								{showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						),
					}}
					{...register("passwordConfirmation")}
					error={errors.passwordConfirmation != null}
					helperText={errors.passwordConfirmation?.message}
				/>
			</CardContent>

			<CardActions>
				<LoadingButton
					type="submit"
					variant="contained"
					disabled={!isDirty}
					loading={isSigningUp}
					sx={{
						m: 1,
					}}
				>
					{t.auth["sign-up"]}
				</LoadingButton>

				<Link href="/auth/sign-in" passHref>
					<Button
						sx={{
							m: 1,
						}}
					>
						{t.auth["already-have-account"]}
					</Button>
				</Link>
			</CardActions>

			<Divider>or</Divider>

			<CardActions
				sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}
			>
				<GoogleLoginButton setIsLoading={setIsSigningUp} />
			</CardActions>
		</Card>
	);
};

export default SignUpForm;
