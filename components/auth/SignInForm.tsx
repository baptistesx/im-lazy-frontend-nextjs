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
import signInFormSchema from "@schemas/signInFormSchema";
import Link from "next/link";
import { useRouter } from "next/router";
import en from "public/locales/en/en";
import fr from "public/locales/fr/fr";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "../../providers/AuthActionsProvider";
import GoogleLoginButton from "./GoogleLoginButton";

type SignInFormData = {
	email: string;
	password: string;
};

const SignInForm = (): ReactElement => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === "en" ? en : fr;

	const authActions = useAuthActions();

	const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { isDirty, errors },
		reset,
	} = useForm<SignInFormData>({
		resolver: yupResolver(signInFormSchema),
	});

	useEffect(() => {
		const subscription = watch(() => {});
		return () => subscription.unsubscribe();
	}, [watch]);

	const onSubmit = (data: SignInFormData): void => {
		setIsSigningIn(true);

		authActions?.login(data.email, data.password, () => {
			setIsSigningIn(false);

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
					{...register("password")}
					error={errors.password != null}
					helperText={errors.password?.message}
				/>
			</CardContent>

			<CardActions>
				<LoadingButton
					type="submit"
					variant="contained"
					disabled={!isDirty}
					loading={isSigningIn}
					sx={{
						m: 1,
					}}
				>
					{t.auth["sign-in"]}
				</LoadingButton>

				<Link href="/auth/reset-password" passHref>
					<Button
						sx={{
							m: 1,
						}}
					>
						{t.auth["forgot-password"]}
					</Button>
				</Link>
			</CardActions>

			<Divider>{t.common.or}</Divider>

			<CardActions
				sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}
			>
				<Link href="/auth/sign-up" passHref>
					<Button
						variant="outlined"
						sx={{
							m: 1,
						}}
					>
						{t.auth["sign-up"]}
					</Button>
				</Link>

				<GoogleLoginButton setIsLoading={setIsSigningIn} />
			</CardActions>
		</Card>
	);
};

export default SignInForm;
