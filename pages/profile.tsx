import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SignedInRoute from "../components/SignedInRoute";
import GetLicenceButton from "../components/users/GetLicenceButton";
import { useAuth } from "../providers/AuthProvider";
import { useSnackbars } from "../providers/SnackbarProvider";
import editProfileFormSchema from "../schemas/editProfileFormSchema";
import { updateUserById } from "../services/userApi";
import { capitalizeFirstLetter, isPremium } from "../utils/functions";

type ProfileSubmitFormData = {
  email: string;
  name: string;
};

function Profile() {
  const auth = useAuth();

  const snackbarsService = useSnackbars();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<ProfileSubmitFormData>({
    resolver: yupResolver(editProfileFormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (data: ProfileSubmitFormData) => {
    setIsLoading(true);

    updateUserById(
      {
        id: auth?.user?.id,
        email: data.email,
        role: auth?.user?.role, //TODO security issue => pass this param optional
        name: data.name,
      },
      () => {
        setIsLoading(false);

        snackbarsService?.addAlert({
          message: "User well updated",
          severity: "success",
        });

        auth?.fetchCurrentUser();

        reset(data);
      }
    );
  };

  return (
    <SignedInRoute>
      <Typography variant="h1">Profile</Typography>

      <Card
        component="form"
        variant="outlined"
        onSubmit={handleSubmit(handleSave)}
      >
        <CardContent>
          <TextField
            fullWidth
            placeholder="Name"
            {...register("name")}
            sx={{ mb: 1 }}
            defaultValue={capitalizeFirstLetter(auth?.user?.name)}
            error={errors.name != null}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            placeholder="Email"
            {...register("email")}
            sx={{ mb: 1 }}
            defaultValue={auth?.user?.email}
            error={errors.email != null}
            helperText={errors.email?.message}
          />
          {/* //TODO: add feature to change password */}
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
    </SignedInRoute>
  );
}

export default Profile;
