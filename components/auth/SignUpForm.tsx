import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
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
import GoogleLoginButton from "./GoogleLoginButton";

//TODO: on google signin, ask to choose an account and don't directly connect to the last used (remove token?)

type SignUpSubmitFormData = {
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
};

const SignUpForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

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

	return (
		<Card
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{ minWidth: 320, maxWidth: 500 }}
		>
			<CardContent>
				<TextField
					fullWidth
					placeholder={t.common.name}
					sx={{ mb: 2 }}
					{...register("name")}
					error={errors.name != null}
					helperText={errors.name?.message}
				/>

				<TextField
					fullWidth
					placeholder={t.common.email}
					sx={{ mb: 2 }}
					{...register("email")}
					error={errors.email != null}
					helperText={errors.email?.message}
				/>

				<TextField
					fullWidth
					type={"password"}
					placeholder={t.common.password}
					sx={{ mb: 2 }}
					{...register("password")}
					error={errors.password != null}
					helperText={errors.password?.message}
				/>

				<TextField
					fullWidth
					type={"password"}
					placeholder={t.auth["confirm-password"]}
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
				<Link href="/auth/sign-in" passHref>
					<Button
						variant="outlined"
						sx={{
							m: 1,
						}}
					>
						{t.auth["sign-in"]}
					</Button>
				</Link>

				<GoogleLoginButton setIsLoading={setIsSigningUp} />
			</CardActions>
		</Card>
	);
};

export default SignUpForm;
