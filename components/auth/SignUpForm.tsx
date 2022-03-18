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
import signUpFormSchema from "../../schemas/signUpFormSchema";
import GoogleLoginButton from "./GoogleLoginButton";

//TODO: on google signin, ask to choose an account and don't directly connect to the last used (remove token?)

type SignUpSubmitFormData = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const SignUpForm = () => {
  const auth = useAuth();

  const [isSigningUp, setIsSigningUp] = useState(false);

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
    const subscription = watch((value, { name, type }) => {});
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: SignUpSubmitFormData) => {
    setIsSigningUp(true);

    auth?.register(data.name, data.email, data.password, () => {
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
          disabled={!isDirty}
          loading={isSigningUp}
          sx={{
            m: 1,
          }}
        >
          Sign up
        </LoadingButton>

        <Link href="/auth/sign-in">
          <Button
            sx={{
              m: 1,
            }}
          >
            I already have an account
          </Button>
        </Link>
      </CardActions>

      <Divider>or</Divider>

      <CardActions
        sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 1 }}
      >
        <Link href="/auth/sign-in">
          <Button
            variant="outlined"
            sx={{
              m: 1,
            }}
          >
            Sign In
          </Button>
        </Link>

        <GoogleLoginButton setIsLoading={setIsSigningUp} />
      </CardActions>
    </Card>
  );
};

export default SignUpForm;
