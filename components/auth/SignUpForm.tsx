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
import signUpFormSchema from "../../schemas/signUpFormSchema";
import { signUpWithEmailAndPassword } from "../../services/userApi";
import GoogleLoginButton from "./GoogleLoginButton";
import { useRouter } from "next/router";

//TODO: on google signin, ask to choose an account and don't directly connect to the last used (remove token?)
//TODO: implement isDirty (see profile.tsx)

type SignUpSubmitFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const SignUpForm = () => {
  const snackbarsService = useSnackbars();

  const router = useRouter();

  const [isSigningUp, setIsSigningUp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpSubmitFormData>({
    resolver: yupResolver(signUpFormSchema),
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: SignUpSubmitFormData) => {
    setIsSigningUp(true);

    signUpWithEmailAndPassword(data.name, data.email, data.password, () => {
      setIsSigningUp(false);

      snackbarsService?.addAlert({
        message: "Welcome", // TODO: use custom message if new user
        severity: "success",
      });

      router.replace("/dashboard");
    }).catch((err: Error) => {
      console.log(err.cause);
      setIsSigningUp(false);

      snackbarsService?.addAlert({
        message:
          "An error occured while signing up. This email might be used already",
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
          placeholder="Name"
          sx={{ mb: 2 }}
          {...register("name")}
          error={errors.name != null}
          helperText={errors.name?.message}
        />

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
          sx={{ mb: 2 }}
          {...register("password")}
          error={errors.password != null}
          helperText={errors.password?.message}
        />

        <TextField
          fullWidth
          type={"password"}
          placeholder="Confirm password"
          {...register("passwordConfirmation")}
          error={errors.passwordConfirmation != null}
          helperText={errors.passwordConfirmation?.message}
        />
      </CardContent>

      <CardActions>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSigningUp}
          sx={{
            m: 1,
          }}
        >
          Sign up
        </LoadingButton>

        <Button
          sx={{
            m: 1,
          }}
          href="/aut/sign-in"
        >
          I already have an account
        </Button>
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
