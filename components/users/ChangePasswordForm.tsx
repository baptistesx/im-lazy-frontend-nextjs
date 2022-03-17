import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbars } from "../../providers/SnackbarProvider";
import updatePasswordFormSchema from "../../schemas/updatePasswordFormSchema";
import { updateUserPasswordById } from "../../services/userApi";
import { isPremium } from "../../utils/functions";
import GetLicenceButton from "./GetLicenceButton";

type ChangePasswordFormData = {
  currentPassword: string;
  newPassword: string;
};

const ChangePasswordForm = () => {
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const snackbarsService = useSnackbars();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(updatePasswordFormSchema),
  });

  const handleSavePassword = async (data: ChangePasswordFormData) => {
    setIsLoading(true);

    updateUserPasswordById(
      {
        id: auth?.user?.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      () => {
        setIsLoading(false);

        snackbarsService?.addAlert({
          message: "Password well updated",
          severity: "success",
        });

        reset();
      }
    ).catch((err: Error) => {
      snackbarsService?.addAlert({
        message: "Error while updating password, check your current password.",
        severity: "error",
      });
      reset(data);
    });
  };

  return (
    <Card
      component="form"
      variant="outlined"
      onSubmit={handleSubmit(handleSavePassword)}
    >
      <CardContent>
        <TextField
          fullWidth
          placeholder="Current password"
          {...register("currentPassword")}
          sx={{ mb: 1 }}
          error={errors.currentPassword != null}
          helperText={errors.currentPassword?.message}
        />

        <TextField
          fullWidth
          placeholder="New password"
          {...register("newPassword")}
          sx={{ mb: 1 }}
          error={errors.newPassword != null}
          helperText={errors.newPassword?.message}
        />
      </CardContent>

      <CardActions>
        <LoadingButton
          type="submit"
          variant="contained"
          disabled={!isDirty}
          loading={isLoading}
          sx={{
            m: 1,
          }}
        >
          Save
        </LoadingButton>

        {!isPremium(auth?.user) ? <GetLicenceButton /> : <Box />}
      </CardActions>
    </Card>
  );
};

export default ChangePasswordForm;
