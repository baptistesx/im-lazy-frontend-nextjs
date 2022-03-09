import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Card, CardActions, CardContent, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { resetPassword } from "../../services/userApi";
import useSnackbars from "../../hooks/useSnackbars";
import resetPasswordFormSchema from "../../schemas/resetPasswordFormSchema";
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
    formState: { errors },
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
          loading={isLoading}
        >
          Reset password
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

export default ResetPasswordForm;
