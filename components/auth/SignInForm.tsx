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
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSnackbars from "../../hooks/useSnackbars";
import { User } from "../../hooks/useUser";
import signInFormSchema from "../../schemas/signInFormSchema";
import { signInWithEmailAndPassword } from "../../services/userApi";
import { useRouter } from "next/router";
import GoogleLoginButton from "./GoogleLoginButton";
import Link from "next/link";

type SignInFormData = {
  email: string;
  password: string;
};

function SignInForm() {
  const snackbarsService = useSnackbars();

  const router = useRouter();

  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: SignInFormData) => {
    setIsSigningIn(true);

    signInWithEmailAndPassword(data.email, data.password, (user: User) => {
      setIsSigningIn(false);

      snackbarsService?.addAlert({
        message: "Welcome", // TODO: use custom message if new user
        severity: "success",
      });

      router.push("/dashboard");
    }).catch((err: Error) => {
      setIsSigningIn(false);

      //TODO: add internet connection checker and customize message error
      snackbarsService?.addAlert({
        message:
          "Check your internet connection or email/password might be invalid",
        severity: "error",
      });
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
          placeholder="Email"
          sx={{ mb: 2 }}
          {...register("email")}
          error={errors.email != null}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          type={"password"}
          placeholder="Password"
          {...register("password")}
          error={errors.password != null}
          helperText={errors.password?.message}
        />
      </CardContent>

      <CardActions>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSigningIn}
          sx={{
            m: 1,
          }}
        >
          Sign In
        </LoadingButton>

        <Link href="/auth/reset-password">
          <Button
            sx={{
              m: 1,
            }}
          >
            I forgot my password
          </Button>
        </Link>
      </CardActions>

      <Divider>or</Divider>

      <CardActions
        sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}
      >
        <GoogleLoginButton setIsLoading={setIsSigningIn} />
      </CardActions>
    </Card>
  );
}

export default SignInForm;
