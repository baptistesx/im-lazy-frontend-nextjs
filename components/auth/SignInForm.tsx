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
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../providers/AuthProvider";
import signInFormSchema from "../../schemas/signInFormSchema";
import GoogleLoginButton from "./GoogleLoginButton";

type SignInFormData = {
  email: string;
  password: string;
};

function SignInForm() {
  const auth = useAuth();

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
    const subscription = watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: SignInFormData) => {
    setIsSigningIn(true);

    auth?.login(data.email, data.password, () => {
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
          disabled={!isDirty}
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
        <Link href="/auth/sign-up">
          <Button
            sx={{
              m: 1,
            }}
          >
            Sign Up
          </Button>
        </Link>

        <GoogleLoginButton setIsLoading={setIsSigningIn} />
      </CardActions>
    </Card>
  );
}

export default SignInForm;
